require('dotenv').config();
const fg = require('fast-glob');
const fs = require('fs');

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

      await tinify
        .fromFile(file)
        .resize({
          method: 'fit',
          width: 1024,
          height: 768,
        })
        .toFile(file.replace(inputDir, outputDir));

      console.log('success.');
    } catch (e) {
      console.log(e);
      console.log('failed.');
    }
  }
}

init();
