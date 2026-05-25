"use client";
/**
 * components/CloudinaryVedio.tsx
 *
 * Production-grade Cloudinary video player.
 * ✅ Proper WebM + MP4 dual-source (no fragile string replace)
 * ✅ Poster thumbnail from first frame
 * ✅ IntersectionObserver lazy loading
 * ✅ Custom play/pause overlay with cinematic styling
 * ✅ Error fallback state
 * ✅ Mobile-friendly playsInline
 * ✅ Accessible aria attributes
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { Play, AlertCircle } from "lucide-react";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const BASE   = CLOUD ? `https://res.cloudinary.com/${CLOUD}` : "";

function buildVideoUrl(publicId: string, width: number, format: "auto" | "webm" | "mp4"): string {
  if (!BASE) return "";
  const fmt = format === "auto" ? "f_auto" : `f_${format}`;
  return `${BASE}/video/upload/${fmt},q_auto,w_${width}/${publicId}`;
}

function buildPosterUrl(publicId: string, width: number): string {
  if (!BASE) return "";
  return `${BASE}/video/upload/f_auto,q_auto:best,w_${width},so_0/${publicId}.jpg`;
}

interface CloudinaryVideoProps {
  /** Cloudinary public_id — no extension */
  src: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  width?: number;
}

export default function CloudinaryVideo({
  src,
  className = "",
  controls = true,
  autoPlay = false,
  loop = false,
  width = 1280,
}: CloudinaryVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const [visible,  setVisible]  = useState(false);
  const [playing,  setPlaying]  = useState(false);
  const [errored,  setErrored]  = useState(false);
  const [loaded,   setLoaded]   = useState(false);

  // Lazy load — only fetch video when viewport-near
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePlay = useCallback(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const mp4Url  = buildVideoUrl(src, width, "mp4");
  const webmUrl = buildVideoUrl(src, width, "webm");
  const poster  = buildPosterUrl(src, width);

  if (errored) {
    return (
      <div
        ref={wrapperRef}
        className={`relative flex items-center justify-center bg-gray-900 rounded-2xl aspect-video ${className}`}
      >
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <AlertCircle size={32} className="text-amber-500/40" />
          <span className="text-sm tracking-wide">Video unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative group ${className}`}>
      {/* Shimmer placeholder while not yet in viewport or loading */}
      {(!visible || !loaded) && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(201,122,6,0.07) 50%, transparent 100%)",
              animation: "shimmer 1.8s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {visible && (
        <video
          ref={videoRef}
          poster={poster}
          controls={controls}
          autoPlay={autoPlay}
          muted={autoPlay}
          loop={loop}
          playsInline
          crossOrigin="anonymous"
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedData={() => setLoaded(true)}
          onError={() => setErrored(true)}
        >
          {/* WebM first — best compression for Chrome/Firefox */}
          <source src={webmUrl} type="video/webm" />
          {/* MP4 — universal Safari/mobile fallback */}
          <source src={mp4Url}  type="video/mp4"  />
          Your browser does not support HTML5 video.
        </video>
      )}

      {/* Custom play button — only when controls are hidden */}
      {!controls && !playing && visible && loaded && (
        <button
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all duration-300 rounded-2xl"
          onClick={handlePlay}
          aria-label="Play video"
        >
          <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-amber-500/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_40px_rgba(201,122,6,0.5)] transition-transform duration-300 group-hover:scale-110">
            <Play size={30} className="text-white ml-1.5" fill="white" />
          </div>
        </button>
      )}
    </div>
  );
}