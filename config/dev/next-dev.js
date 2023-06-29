const { exec } = require('child_process');
const { cleanJSDocNextPath } = require('../../constants/paths');
const { createDir } = require('../../src/utils/file');

createDir(cleanJSDocNextPath);

process.chdir(cleanJSDocNextPath);
exec('npm run dev').stdout.pipe(process.stdout);
