"use client";
/**
 * components/CloudinaryImage.tsx
 *
 * Drop-in wrapper around next-cloudinary's <CldImage>.
 * ✅ Auto AVIF / WebP format (f_auto from Cloudinary)
 * ✅ Auto quality   (q_auto from Cloudinary)
 * ✅ AI smart-crop  (g_auto keeps faces in frame)
 * ✅ Shimmer skeleton while loading
 * ✅ Camera-icon fallback on error
 * ✅ Accepts style prop for inline overrides
 *
 * USAGE (fill — for cards and galleries):
 *   <CloudinaryImage
 *     src="deehar-productions/photos/wedding/(3)"
 *     alt="Wedding"
 *     fill
 *     className="object-cover"
 *   />
 *
 * USAGE (fixed size):
 *   <CloudinaryImage
 *     src="deehar-productions/photos/Fashion/5"
 *     alt="Fashion"
 *     width={800}
 *     height={600}
 *   />
 */

import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { Camera } from "lucide-react";
import type { CSSProperties } from "react";

interface CloudinaryImageProps {
  /** Cloudinary public_id — no leading slash, no extension */
  src: string;
  alt: string;
  /** Use fill for parent-relative sizing (cards, hero) */
  fill?: boolean;
  width?: number;
  height?: number;
  /** Add priority for above-the-fold / hero images (disables lazy load) */
  priority?: boolean;
  className?: string;
  crop?: "auto" | "fill" | "fit" | "thumb" | "scale";
  sizes?: string;
  style?: CSSProperties;
}

export default function CloudinaryImage({
  src,
  alt,
  fill = false,
  width  = 1200,
  height = 800,
  priority = false,
  className = "",
  crop = "fill",
  sizes,
  style,
}: CloudinaryImageProps) {
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  // ── Error fallback ──────────────────────────────────────────────────────
  if (errored) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/60 text-amber-500/40">
        <Camera size={24} />
        <span className="text-[0.6rem] mt-2 tracking-widest uppercase opacity-60">
          Unavailable
        </span>
      </div>
    );
  }

  // Default sizes: optimised for gallery grids
  const defaultSizes = fill
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : undefined;

  return (
    <>
      {/* Shimmer skeleton while image loads */}
      {loading && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse z-10"
          aria-hidden="true"
        />
      )}

      {fill ? (
        // ✅ fill mode — NO width/height props allowed
        <CldImage
          src={src}
          alt={alt}
          fill
          crop={{ type: crop, source: true }}
          sizes={sizes ?? defaultSizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          priority={priority}
          className={`transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"} ${className}`}
          style={style}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setErrored(true); }}
        />
      ) : (
        // ✅ fixed size mode — width/height required, NO fill
        <CldImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          crop={{ type: crop, source: true }}
          priority={priority}
          className={`transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"} ${className}`}
          style={style}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setErrored(true); }}
        />
      )}
    </>
  );
}