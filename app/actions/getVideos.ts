"use server";

import fs from "fs/promises";
import path from "path";

export type VideoData = {
  src: string;
  type: string;
  category: string;
  filename: string;
  isMov: boolean;
};

export async function getLocalVideos(): Promise<VideoData[]> {
  const photosDir = path.join(process.cwd(), "public", "photos");
  const videos: VideoData[] = [];

  try {
    // Check if the directory exists
    await fs.access(photosDir);
    
    // Read subdirectories
    const categories = await fs.readdir(photosDir, { withFileTypes: true });
    
    for (const category of categories) {
      if (category.isDirectory()) {
        const categoryPath = path.join(photosDir, category.name);
        const files = await fs.readdir(categoryPath);
        
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();
          
          if (ext === ".mp4" || ext === ".mov") {
            const filePath = path.join(categoryPath, file);
            
            try {
              const stat = await fs.stat(filePath);
              // Skip empty or tiny corrupted files (e.g. 4KB macOS dotfiles or failed uploads)
              // Minimum valid video size is assumed to be > 100KB (102400 bytes)
              if (stat.size < 100000) {
                console.warn(`Skipping too small/corrupted video file: ${filePath} (${stat.size} bytes)`);
                continue;
              }
              
              const isMov = ext === ".mov";
              videos.push({
                src: `/photos/${category.name}/${file}`,
                type: isMov ? "video/quicktime" : "video/mp4",
                category: category.name,
                filename: file,
                isMov,
              });
            } catch (err) {
              console.error(`Failed to stat file ${filePath}:`, err);
            }
          }
        }
      }
    }
    
    // Sort videos to have a consistent order (optional)
    return videos.sort((a, b) => a.src.localeCompare(b.src));
  } catch (error) {
    console.error("Error reading video files:", error);
    return [];
  }
}
