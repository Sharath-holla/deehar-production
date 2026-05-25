/**
 * app/api/upload-video/route.ts
 *
 * POST /api/upload-video
 * Body: FormData { file: File, folder?: string }
 * Returns: { public_id, secure_url, duration, width, height, format, bytes }
 */

import { NextRequest, NextResponse } from "next/server";
import { getCloudinaryAdmin } from "@/lib/cloudinary-admin";

const MAX_BYTES = 500 * 1024 * 1024; // 500 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file     = formData.get("file")   as File   | null;
    const folder   = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File exceeds 500 MB limit." }, { status: 413 });
    }
    const allowed = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 415 });
    }

    const buffer  = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const cloudinary = await getCloudinaryAdmin();
    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "video",
      folder:        folder ?? "deehar-productions/videos",
      public_id:     file.name.replace(/\.[^/.]+$/, ""),
      overwrite:     true,
      // Cloudinary transcodes to MP4 + WebM automatically on delivery
      eager: [
        { format: "mp4",  quality: "auto" },
        { format: "webm", quality: "auto" },
      ],
      eager_async: true,
    });

    return NextResponse.json({
      public_id:  result.public_id,
      secure_url: result.secure_url,
      duration:   result.duration,
      width:      result.width,
      height:     result.height,
      format:     result.format,
      bytes:      result.bytes,
    });
  } catch (err: any) {
    console.error("[/api/upload-video]", err);
    return NextResponse.json({ error: err?.message ?? "Upload failed." }, { status: 500 });
  }
}