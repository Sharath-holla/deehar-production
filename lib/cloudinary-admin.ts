/**
 * lib/cloudinary-admin.ts
 *
 * SERVER-ONLY Cloudinary Admin SDK helper.
 *
 * ⚠️  Import this ONLY inside:
 *      - app/api/** route files
 *      - Server Actions
 *      - scripts/**
 *
 * NEVER import this in "use client" components or lib/cloudinary.ts.
 * The cloudinary Node SDK uses fs/path which are not available in the browser.
 */

export async function getCloudinaryAdmin() {
  const { v2: cloudinary } = await import("cloudinary");
  cloudinary.config({
    cloud_name:  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key:     process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECRET,
    secure:      true,
  });
  return cloudinary;
}
