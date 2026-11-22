import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle2, XCircle, Search } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.getAdminUsers()
      .then((res) => {
        if (res.success && res.users) {
          setUsers(res.users);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: User) => {
    try {
      const res = await api.toggleUserStatus(user.id, !user.isActive);
      if (res.success) {
        fetchUsers();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">User Management</h1>
          <p className="text-xs text-muted mt-1">
            Registered traveler identities and administrator access controls in User Service.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-ivory-100 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-gold-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-ivory-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted">Loading user accounts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-muted uppercase font-semibold border-b border-ivory-100">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Registered</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-ivory-50/50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-900">{u.name}</div>
                      <div className="text-[10px] text-muted">{u.phone || 'No phone'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-navy-900 text-gold-400'
                            : 'bg-ivory-100 text-navy-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          u.isActive ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {u.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{u.isActive ? 'Active' : 'Deactivated'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                          u.isActive
                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
