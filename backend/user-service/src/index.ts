import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { User, UserPreference, UserRole } from '../../../shared/common-types';
import { eventBus } from '../../../shared/event-bus';
import { RABBITMQ_CONFIG } from '../../../shared/event-contracts';

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'aurevia_super_secret_jwt_key_2026';
const DATA_FILE = path.resolve(__dirname, '../data/users.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface UsersStore {
  users: Array<User & { passwordHash: string }>;
  preferences: UserPreference[];
}

function loadData(): UsersStore {
  if (!fs.existsSync(DATA_FILE)) {
    // Seed initial users: Admin & Demo Traveler
    const salt = bcrypt.genSaltSync(10);
    const initialUsers: UsersStore = {
      users: [
        {
          id: 'usr_admin_001',
          email: 'admin@aurevia.com',
          name: 'Aurevia Administrator',
          role: 'ADMIN',
          isActive: true,
          phone: '+91 98765 43210',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          passwordHash: bcrypt.hashSync('Admin@12345', salt),
          createdAt: new Date('2026-01-01').toISOString(),
          updatedAt: new Date('2026-01-01').toISOString(),
        },
        {
          id: 'usr_demo_002',
          email: 'traveler@aurevia.com',
          name: 'Aarav Sharma',
          role: 'USER',
          isActive: true,
          phone: '+91 91234 56789',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          passwordHash: bcrypt.hashSync('Traveler@12345', salt),
          createdAt: new Date('2026-01-10').toISOString(),
          updatedAt: new Date('2026-01-10').toISOString(),
        },
      ],
      preferences: [
        {
          id: 'pref_demo_002',
          userId: 'usr_demo_002',
          categories: ['Nature', 'Heritage and History', 'Cultural Experiences'],
          travelStyle: 'Scenic & Cultural',
          preferredState: 'Kerala',
          availableDays: 3,
          dietaryPreference: 'Vegetarian',
          createdAt: new Date('2026-01-10').toISOString(),
          updatedAt: new Date('2026-01-10').toISOString(),
        },
      ],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialUsers, null, 2), 'utf8');
    return initialUsers;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { users: [], preferences: [] };
  }
}

function saveData(data: UsersStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

// Initialize EventBus
eventBus.initialize().catch((err) => console.warn('[User-Service] Event bus init warning:', err));

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Middleware to verify JWT token
export function authenticateToken(req: any, res: Response, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ service: 'user-service', status: 'HEALTHY', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, errors: parse.error.format() });
    }
    const { name, email, password, phone } = parse.data;
    const store = loadData();

    if (store.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      name,
      phone: phone || '',
      role: 'USER' as UserRole,
      isActive: true,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.users.push(newUser);

    // Initial empty preference
    store.preferences.push({
      id: `pref_${userId}`,
      userId,
      categories: ['Nature', 'Cultural Experiences'],
      travelStyle: 'Relaxed',
      availableDays: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    saveData(store);

    // Publish event
    await eventBus.publish(RABBITMQ_CONFIG.ROUTING_KEYS.USER_REGISTERED, {
      userId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      timestamp: newUser.createdAt,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userSafe } = newUser;
    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: userSafe,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, message: 'Invalid credentials format' });
    }
    const { email, password } = parse.data;
    const store = loadData();

    const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated. Contact support.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userSafe } = user;
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userSafe,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req: any, res: Response) => {
  const store = loadData();
  const user = store.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { passwordHash: _, ...userSafe } = user;
  res.json({ success: true, user: userSafe });
});

app.put('/api/auth/profile', authenticateToken, (req: any, res: Response) => {
  const store = loadData();
  const index = store.users.findIndex((u) => u.id === req.user.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });

  const { name, phone, avatarUrl } = req.body;
  if (name) store.users[index].name = name;
  if (phone !== undefined) store.users[index].phone = phone;
  if (avatarUrl) store.users[index].avatarUrl = avatarUrl;
  store.users[index].updatedAt = new Date().toISOString();

  saveData(store);
  const { passwordHash: _, ...userSafe } = store.users[index];
  res.json({ success: true, message: 'Profile updated', user: userSafe });
});

app.get('/api/auth/preferences', authenticateToken, (req: any, res: Response) => {
  const store = loadData();
  const pref = store.preferences.find((p) => p.userId === req.user.id) || {
    id: `pref_${req.user.id}`,
    userId: req.user.id,
    categories: ['Nature', 'Cultural Experiences'],
    availableDays: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  res.json({ success: true, preferences: pref });
});

app.put('/api/auth/preferences', authenticateToken, (req: any, res: Response) => {
  const store = loadData();
  let index = store.preferences.findIndex((p) => p.userId === req.user.id);
  const { categories, travelStyle, preferredState, availableDays, dietaryPreference } = req.body;

  if (index === -1) {
    const newPref: UserPreference = {
      id: `pref_${Date.now()}`,
      userId: req.user.id,
      categories: categories || ['Nature'],
      travelStyle,
      preferredState,
      availableDays: availableDays || 3,
      dietaryPreference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.preferences.push(newPref);
    saveData(store);
    return res.json({ success: true, preferences: newPref });
  }

  store.preferences[index] = {
    ...store.preferences[index],
    categories: categories || store.preferences[index].categories,
    travelStyle: travelStyle ?? store.preferences[index].travelStyle,
    preferredState: preferredState ?? store.preferences[index].preferredState,
    availableDays: availableDays ?? store.preferences[index].availableDays,
    dietaryPreference: dietaryPreference ?? store.preferences[index].dietaryPreference,
    updatedAt: new Date().toISOString(),
  };

  saveData(store);
  res.json({ success: true, preferences: store.preferences[index] });
});

// Admin endpoints
app.get('/api/users', authenticateToken, (req: any, res: Response) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  const store = loadData();
  const safeUsers = store.users.map(({ passwordHash: _, ...rest }) => rest);
  res.json({ success: true, users: safeUsers });
});

app.patch('/api/users/:id/status', authenticateToken, (req: any, res: Response) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  const store = loadData();
  const user = store.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.isActive = req.body.isActive !== undefined ? req.body.isActive : !user.isActive;
  user.updatedAt = new Date().toISOString();
  saveData(store);

  const { passwordHash: _, ...userSafe } = user;
  res.json({ success: true, message: `User status updated to ${user.isActive ? 'Active' : 'Deactivated'}`, user: userSafe });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[User-Service] Server listening on port ${PORT}`);
  });
}

export default app;
