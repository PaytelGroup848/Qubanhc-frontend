const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const viteCli = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
const children = [
  spawn(process.execPath, [path.join(__dirname, 'index.cjs')], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
  }),
  spawn(process.execPath, [viteCli], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
  }),
];

let shuttingDown = false;

const stopChildren = (exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  children.forEach((child) => {
    if (!child.killed) child.kill();
  });

  process.exit(exitCode);
};

children.forEach((child) => {
  child.on('error', () => stopChildren(1));
  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) stopChildren(code || 1);
  });
});

process.on('SIGINT', () => stopChildren(0));
process.on('SIGTERM', () => stopChildren(0));
