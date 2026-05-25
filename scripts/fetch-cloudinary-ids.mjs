/**
 * scripts/fetch-cloudinary-ids.mjs
 *
 * Uses Cloudinary Search API to find real public_ids in every folder.
 * Usage: node scripts/fetch-cloudinary-ids.mjs
 */

import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

const FOLDERS = [
  "deehar-productions/photos/wedding",
  "deehar-productions/photos/naming-ceremony",
  "deehar-productions/photos/baby_shower",
  "deehar-productions/photos/pre_wedding",
  "deehar-productions/photos/ad_shoot",
  "deehar-productions/photos/Birthday",
  "deehar-productions/photos/Fashion",
  "deehar-productions/photos/Corporate",
  "deehar-productions/photos/real_estate",
  "deehar-productions/photos/Films",
  "deehar-productions/photos/bts",
  "deehar-productions/photos/engagement",
  "deehar-productions/photos/new_born",
];

async function searchFolder(folder, resourceType = "image") {
  const results = [];
  let nextCursor = undefined;

  do {
    const query = cloudinary.search
      .expression(`folder="${folder}" AND resource_type=${resourceType}`)
      .sort_by("public_id", "asc")
      .max_results(500);

    if (nextCursor) query.next_cursor(nextCursor);

    const res = await query.execute();
    results.push(...(res.resources || []));
    nextCursor = res.next_cursor;
  } while (nextCursor);

  return results.map((r) => r.public_id);
}

async function listRootAssets() {
  // Probe: list a sample of all assets to see what's actually in the account
  const res = await cloudinary.search
    .expression("resource_type:image")
    .sort_by("public_id", "asc")
    .max_results(10)
    .execute();
  return res.resources || [];
}

async function main() {
  console.log("Probing Cloudinary account for sample assets...\n");

  // First: probe to see actual public_id format
  const sample = await listRootAssets();
  if (sample.length === 0) {
    console.log("⚠  No assets found at all — check your API credentials.");
    return;
  }
  console.log("Sample public_ids found in account:");
  sample.forEach((r) => console.log(`  ${r.public_id}  (folder: ${r.folder ?? "root"})`));

  console.log("\n\nFetching all folders...\n");

  const output = {};

  for (const folder of FOLDERS) {
    const folderName = folder.split("/").pop();
    try {
      const [images, videos] = await Promise.all([
        searchFolder(folder, "image"),
        searchFolder(folder, "video"),
      ]);

      output[folderName] = { images, videos, folder };
      console.log(`\n── ${folderName} (${images.length} images, ${videos.length} videos) ──`);
      images.slice(0, 5).forEach((id) => console.log(`  img: "${id}"`));
      if (images.length > 5) console.log(`  ... and ${images.length - 5} more`);
      videos.forEach((id) => console.log(`  vid: "${id}"`));
    } catch (err) {
      console.log(`  ⚠ ${folderName}: ${err.message}`);
      output[folderName] = { images: [], videos: [], folder };
    }
  }

  // Print ready-to-paste data
  console.log("\n\n════════════════════════════════════════");
  console.log("READY-TO-PASTE gallery arrays for lib/data.ts");
  console.log("════════════════════════════════════════\n");

  for (const [name, { images, videos }] of Object.entries(output)) {
    if (images.length === 0 && videos.length === 0) continue;
    console.log(`// ── ${name} ─────────────────────────`);
    if (images.length > 0) {
      console.log(`coverImage: "${images[0]}",`);
      console.log(`gallery: [`);
      images.forEach((id) => console.log(`  "${id}",`));
      console.log(`],`);
    }
    if (videos.length > 0) {
      console.log(`videoUrls: [`);
      videos.forEach((id) => console.log(`  "${id}",`));
      console.log(`],`);
    }
    console.log();
  }
}

main().catch(console.error);
