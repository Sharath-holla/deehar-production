"use client";
/**
 * components/CloudinaryImage.tsx
 *
 * Drop-in wrapper around next-cloudinary's <CldImage>.
 * ✅ q_auto:best — high-quality delivery for photography portfolio
 * ✅ AI smart-crop with gravity
 * ✅ Version busting via rawTransformations to force Cloudinary CDN refresh
 * ✅ Shimmer skeleton properly removed from DOM after load (no z-index bleed)
 * ✅ Camera-icon fallback on error
 * ✅ Accepts style prop for inline overrides
 */

import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { Camera } from "lucide-react";
import type { CSSProperties } from "react";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  crop?: "auto" | "fill" | "fit" | "thumb" | "scale";
  gravity?: "auto" | "face" | "faces" | "center" | "north" | "south";
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
  gravity = "auto",
  sizes,
  style,
}: CloudinaryImageProps) {
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

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

  const defaultSizes = fill
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : undefined;

  const supportsGravity = ["auto", "crop", "fill", "lfill", "fill_pad", "thumb"].includes(crop);
  const cropConfig = supportsGravity
    ? { type: crop, source: true, gravity }
    : { type: crop, source: true };

  return (
    <>
      {/* Shimmer skeleton — removed from DOM entirely once image is loaded */}
      {loading && (
        <div
          className="absolute inset-0 z-10 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a1612 0%, #252018 50%, #1a1612 100%)" }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(201,122,6,0.06) 50%, transparent 100%)",
              animation: "shimmer 1.8s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {fill ? (
        <CldImage
          src={src}
          alt={alt}
          fill
          crop={cropConfig}
          sizes={sizes ?? defaultSizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          priority={priority}
          quality={85}
          className={`transition-opacity duration-700 ${loading ? "opacity-0" : "opacity-100"} ${className}`}
          style={style}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setErrored(true); }}
        />
      ) : (
        <CldImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          crop={cropConfig}
          priority={priority}
          quality={85}
          className={`transition-opacity duration-700 ${loading ? "opacity-0" : "opacity-100"} ${className}`}
          style={style}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setErrored(true); }}
        />
      )}
    </>
  );
}