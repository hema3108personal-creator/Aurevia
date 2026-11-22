const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.gemini',
  'pgdata',
  'rabbitmq_data',
];

const IGNORE_FILES = [
  'audit_events.log',
  '.env',
  'mingit.zip',
];

function getAllFiles(dirPath, arrayOfFiles = [], baseDir = dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.includes(entry.name)) {
        getAllFiles(path.join(dirPath, entry.name), arrayOfFiles, baseDir);
      }
    } else {
      if (!IGNORE_FILES.includes(entry.name) && !entry.name.endsWith('.log')) {
        const relPath = path.relative(baseDir, path.join(dirPath, entry.name)).replace(/\\/g, '/');
        arrayOfFiles.push(relPath);
      }
    }
  }

  return arrayOfFiles;
}

async function initAndCommit() {
  const dir = path.resolve(__dirname, '..');
  console.log('Initializing git repository in:', dir);
  
  await git.init({ fs, dir, defaultBranch: 'main' });

  console.log('Scanning project files...');
  const files = getAllFiles(dir);
  console.log(`Found ${files.length} project files to stage.`);

  for (const filepath of files) {
    await git.add({ fs, dir, filepath });
  }
  console.log(`✓ Staged all ${files.length} files into Git index.`);

  console.log('Creating commit on branch main...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'hema3108personal-creator',
      email: 'creator@aurevia.com',
    },
    message: 'Initial commit: AUREVIA Event-Driven Microservices Travel Platform',
  });
  console.log('✓ Commit created successfully! SHA:', sha);

  console.log('Setting remote origin: https://github.com/hema3108personal-creator/Aurevia.git');
  try {
    await git.deleteRemote({ fs, dir, remote: 'origin' });
  } catch (e) {
    // remote might not exist
  }
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: 'https://github.com/hema3108personal-creator/Aurevia.git',
  });
  console.log('✓ Remote origin configured: https://github.com/hema3108personal-creator/Aurevia.git');
}

initAndCommit().catch((err) => {
  console.error('Git error:', err);
  process.exit(1);
});
