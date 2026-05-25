/**
 * app/api/upload/route.ts
 *
 * POST /api/upload
 * Body: FormData { file: File, folder?: string }
 * Returns: { public_id, secure_url, width, height, format, bytes }
 *
 * Your API_SECRET stays on the server — never in the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCloudinaryAdmin } from "@/lib/cloudinary-admin";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file     = formData.get("file")   as File   | null;
    const folder   = formData.get("folder") as string | null;

    // ── Validate ──────────────────────────────────────────────────────────
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File exceeds 10 MB limit." }, { status: 413 });
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 415 });
    }

    // ── Convert to base64 data URI ────────────────────────────────────────
    const buffer  = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    // ── Upload ────────────────────────────────────────────────────────────
    const cloudinary = await getCloudinaryAdmin();
    const result = await cloudinary.uploader.upload(dataUri, {
      folder:        folder ?? "deehar-productions/uploads",
      public_id:     file.name.replace(/\.[^/.]+$/, ""), // filename without extension
      resource_type: "image",
      overwrite:     true,
    });

    return NextResponse.json({
      public_id:  result.public_id,
      secure_url: result.secure_url,
      width:      result.width,
      height:     result.height,
      format:     result.format,
      bytes:      result.bytes,
    });
  } catch (err: any) {
    console.error("[/api/upload]", err);
    return NextResponse.json({ error: err?.message ?? "Upload failed." }, { status: 500 });
  }
}