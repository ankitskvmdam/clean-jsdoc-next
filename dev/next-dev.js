const path = require('path');
const { exec } = require('child_process');

const cleanJSDocNextPath = path.join(__dirname, '..', '.clean-jsdoc-next');

process.chdir(cleanJSDocNextPath);
exec('npm run dev').stdout.pipe(process.stdout);
