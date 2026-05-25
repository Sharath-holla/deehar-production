import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

// Get the root directory
const rootDir = process.cwd();
const photosDir = path.join(rootDir, 'public', 'photos');

async function optimizeVideos() {
  console.log('🎬 Starting Cinematic Video Optimization...');
  console.log('Checking for FFmpeg installation...');
  
  try {
    await execAsync('ffmpeg -version');
  } catch (error) {
    console.error('❌ FFmpeg is not installed or not in PATH.');
    console.error('Please install FFmpeg to run this script:');
    console.error('Windows: choco install ffmpeg (or download from gyan.dev)');
    console.error('Mac: brew install ffmpeg');
    console.error('Linux: sudo apt install ffmpeg');
    process.exit(1);
  }

  try {
    const categories = await fs.readdir(photosDir, { withFileTypes: true });
    
    for (const category of categories) {
      if (!category.isDirectory()) continue;
      
      const categoryPath = path.join(photosDir, category.name);
      const files = await fs.readdir(categoryPath);
      
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        
        if (ext === '.mov' || ext === '.mp4') {
          const inputPath = path.join(categoryPath, file);
          const filenameBase = path.basename(file, ext);
          
          // Skip if we are looking at an already optimized file
          if (filenameBase.endsWith('-optimized')) continue;
          
          const outputPath = path.join(categoryPath, `${filenameBase}-optimized.mp4`);
          
          // Check if optimized version already exists
          try {
            await fs.access(outputPath);
            console.log(`⏩ Skipping ${file} (Already optimized)`);
            continue;
          } catch (e) {
            // File does not exist, proceed with optimization
          }
          
          console.log(`⚙️ Optimizing ${file}...`);
          
          // FFmpeg command for web-optimized video
          // -c:v libx264: H.264 video codec
          // -crf 28: Good compression (visually lossless for most users, small file size)
          // -preset medium: Good balance of encoding speed vs file size
          // -c:a aac -b:a 128k: Compress audio
          // -vf "scale='min(1920,iw)':-2": Scale down to 1080p width max, maintaining aspect ratio
          // -movflags +faststart: Web optimization for faster loading
          
          const ffmpegCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -vf "scale='min(1920,iw)':-2" -movflags +faststart -y "${outputPath}"`;
          
          try {
            await execAsync(ffmpegCommand);
            console.log(`✅ Successfully optimized: ${outputPath}`);
            
            // Delete original file to save space (Optional)
            console.log(`🗑️ Deleting original file: ${file}`);
            await fs.unlink(inputPath);
            
            // Rename optimized file back to original filename with .mp4 extension
            const finalPath = path.join(categoryPath, `${filenameBase}.mp4`);
            await fs.rename(outputPath, finalPath);
            console.log(`🔄 Renamed to ${filenameBase}.mp4`);
            
          } catch (err) {
            console.error(`❌ Failed to optimize ${file}:`, err.message);
          }
        }
      }
    }
    
    console.log('🎉 All videos optimized successfully!');
  } catch (error) {
    console.error('Error scanning directories:', error);
  }
}

optimizeVideos();
