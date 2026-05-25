/**
 * lib/cloudinary.ts
 *
 * CLIENT-SAFE utility helpers for Cloudinary video URLs.
 * ✅ Safe to import in "use client" components.
 * ✅ No Node.js modules — pure string building.
 *
 * For server-side admin SDK, import from "@/lib/cloudinary-admin" instead.
 */

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const BASE  = `https://res.cloudinary.com/${CLOUD}`;

// ─── Video URL ──────────────────────────────────────────────────────────────

/**
 * Returns an optimised Cloudinary video URL.
 * Cloudinary serves WebM to Chrome, MP4 to Safari automatically via f_auto.
 *
 * @param publicId  e.g. "deehar-productions/photos/Corporate/1"
 */
export function getCldVideoUrl(publicId: string, width = 1280): string {
  if (!CLOUD) return "";
  return `${BASE}/video/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

/**
 * Returns a poster (thumbnail) image URL extracted from a video.
 *
 * @param publicId  e.g. "deehar-productions/photos/Corporate/1"
 */
export function getCldVideoPoster(publicId: string, width = 1280): string {
  if (!CLOUD) return "";
  // Cloudinary generates a JPG frame at 0 seconds from the video
  return `${BASE}/video/upload/f_auto,q_auto,w_${width},so_0/${publicId}.jpg`;
}