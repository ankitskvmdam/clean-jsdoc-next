const { exec } = require('child_process');
const { cleanJSDocNextPath } = require('../../constants/paths');

process.chdir(cleanJSDocNextPath);
exec('npm run dev').stdout.pipe(process.stdout);
