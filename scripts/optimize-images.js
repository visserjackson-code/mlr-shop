const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const inputDir = path.join(__dirname, '../public/covers');
const outputDir = path.join(__dirname, '../public/covers-optimized');
const backupDir = path.join(__dirname, '../backups');

// Create backup
async function createBackup() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `covers-backup-${timestamp}.zip`);
  
  console.log('Creating backup...');
  
  const output = fs.createWriteStream(backupPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`✓ Backup created: ${backupPath} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
      resolve();
    });

    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(inputDir, 'covers');
    archive.finalize();
  });
}

// Optimize images
async function optimizeImages() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const allFiles = fs.readdirSync(inputDir);
  const files = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
  });

  console.log(`\nFound ${files.length} images to convert...`);

  await Promise.all(
    files.map(async (file) => {
      const inputPath = path.join(inputDir, file);
      const baseName = path.basename(file, path.extname(file));
      const outputPath = path.join(outputDir, `${baseName}.webp`);
      
      await sharp(inputPath)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      console.log(`✓ ${file} → ${baseName}.webp`);
    })
  );

  console.log('\nDone! Images saved to public/covers-optimized');
}

// Run both
(async () => {
  try {
    await createBackup();
    await optimizeImages();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();