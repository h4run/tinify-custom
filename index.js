require('dotenv').config();
const fg = require('fast-glob');
const fs = require('fs');
const im = require('imagemagick');

const tinify = require('tinify');
tinify.key = process.env.TINIFY_KEY;

const inputDir = 'input';
const outputDir = 'output';

async function createOutputDirs() {
  const dirs = await fg(inputDir + '/**', { onlyDirectories: true });

  const createFolderList = [...dirs, outputDir]
    .map((dir) => dir.replace(inputDir, outputDir))
    .sort((a, b) => b.length - a.length);

  createFolderList.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function getFileDistPath(file) {
  return file.replace(inputDir, outputDir).replace('.JPG', '.jpg');
}

async function resize(file) {
  return new Promise((resolve, reject) => {
    const dstPath = getFileDistPath(file);
    im.resize(
      {
        srcPath: file,
        dstPath,
        width: 1024,
        quality: 1,
      },
      function (err, stdout, stderr) {
        if (err) reject(err);
        resolve(dstPath);
      }
    );
  });
}

async function init() {
  await createOutputDirs();

  const fgImages = await fg(inputDir + '/**/*.?(png|jpg)', {
    onlyFiles: true,
    caseSensitiveMatch: false,
  });

  const images = fgImages.filter(
    (file) => !fs.existsSync(file.replace(inputDir, outputDir))
  );

  for (const image in images) {
    const file = images[image];
    try {
      console.log(file, 'pending...');

      const resizedFile = await resize(file);
      await tinify.fromFile(resizedFile).toFile(resizedFile);

      console.log('success.');
    } catch (e) {
      console.log(e);
      console.log('failed.');
    }
  }
}

init();
