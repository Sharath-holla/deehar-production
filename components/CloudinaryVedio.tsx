"use client";
/**
 * components/CloudinaryVideo.tsx
 *
 * Renders a Cloudinary-hosted video.
 * ✅ Serves WebM to Chrome, MP4 to Safari (f_auto)
 * ✅ Auto quality
 * ✅ Poster from first frame
 * ✅ Lazy loads — only fetches when it enters the viewport
 * ✅ Custom play button overlay (when controls={false})
 *
 * USAGE:
 *   <CloudinaryVideo src="deehar-productions/photos/Corporate/1" />
 */

import { useRef, useEffect, useState } from "react";
import { Play } from "lucide-react";
import { getCldVideoUrl, getCldVideoPoster } from "@/lib/cloudinary";

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

  // Only load the video when it scrolls into view
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const mp4Url  = getCldVideoUrl(src, width);
  const webmUrl = getCldVideoUrl(src, width).replace("f_auto", "f_webm");
  const poster  = getCldVideoPoster(src, width);

  return (
    <div ref={wrapperRef} className={`relative group ${className}`}>
      {visible ? (
        <video
          ref={videoRef}
          poster={poster}
          controls={controls}
          autoPlay={autoPlay}
          muted={autoPlay}     // muted required for autoplay in browsers
          loop={loop}
          playsInline          // prevents iOS full-screen takeover
          className="w-full h-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {/* WebM — smaller, Chrome/Firefox */}
          <source src={webmUrl} type="video/webm" />
          {/* MP4 — universal fallback */}
          <source src={mp4Url}  type="video/mp4"  />
          Your browser does not support HTML5 video.
        </video>
      ) : (
        /* Grey box while out of viewport */
        <div className="w-full aspect-video bg-gray-900 animate-pulse" aria-hidden="true" />
      )}

      {/* Overlay play button when controls are hidden */}
      {!controls && !playing && visible && (
        <button
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          onClick={() => videoRef.current?.play()}
          aria-label="Play video"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center shadow-lg">
            <Play size={28} className="text-white ml-1" fill="white" />
          </div>
        </button>
      )}
    </div>
  );
}