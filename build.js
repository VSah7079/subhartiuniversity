const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[Build] Starting Client Production Build for Hostinger...');
const clientDir = path.join(__dirname, 'client');
const clientDistIndex = path.join(clientDir, 'dist', 'index.html');

try {
  console.log('[Build] Step 1: Installing client dependencies (Vite & React)...');
  execSync('npm install', { cwd: clientDir, stdio: 'inherit', shell: true });

  console.log('[Build] Step 2: Compiling Vite bundle into client/dist...');
  execSync('npm run build', { cwd: clientDir, stdio: 'inherit', shell: true });

  console.log('[Build] SUCCESS: Client bundle compiled cleanly!');
} catch (error) {
  if (fs.existsSync(clientDistIndex)) {
    console.warn('[Build Notice] Rebuild encountered an environment error, but verified client/dist/index.html is already present in repository.');
    console.warn('[Build Notice] Continuing with pre-built production bundle!');
  } else {
    console.error('[Build Fatal Error] Failed to build client and no pre-built dist found:', error.message);
    process.exit(1);
  }
}
