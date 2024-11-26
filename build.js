import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Directories
const libDir = './lib/template';
const additionalFilesDir = './template'; // Adjust to your additional files source directory

// Files/extensions to copy (customize as needed)
const fileExtensionsToCopy = ['.ttf', '.png', '.md'];

// Step 1: Remove the `lib` directory
/**
 *
 */
const removeLibDir = () => {
  if (fs.existsSync(libDir)) {
    fs.rmSync(libDir, { recursive: true, force: true });
  }
};

// Step 2: Run TypeScript compilation (tsc)
/**
 *
 */
const compileTypeScript = () => {
  return new Promise((resolve, reject) => {
    exec('tsc', (err, _stdout, stderr) => {
      if (err) {
        console.error('Error during TypeScript compilation:', stderr);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Step 3: Copy additional files
/**
 *
 */
const copyAdditionalFiles = () => {
  /**
   *
   */
  const copyFilesRecursive = (srcDir, destDir) => {
    fs.readdirSync(srcDir).forEach((file) => {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);
      const stats = fs.statSync(srcPath);

      if (stats.isDirectory()) {
        // Recursively process directories
        copyFilesRecursive(srcPath, destPath);
      } else if (fileExtensionsToCopy.includes(path.extname(file))) {
        // Copy files with the specified extensions
        fs.copyFileSync(srcPath, destPath);
      }
    });
  };

  copyFilesRecursive(additionalFilesDir, libDir);
};

// Main Build Script
/**
 *
 */
const build = async () => {
  try {
    removeLibDir();
    await compileTypeScript();
    copyAdditionalFiles();
  } catch (err) {
    console.error('Build process failed:', err);
  }
};

build();
