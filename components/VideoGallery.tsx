"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getLocalVideos, VideoData } from "@/app/actions/getVideos";
import { motion, useInView } from "framer-motion";
import { Play, Pause, AlertCircle, Film } from "lucide-react";


const CB: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.65, delay: i * 0.08, ease: CB },
  }),
};

// Skeleton card for loading state
function VideoSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="rounded-3xl overflow-hidden border border-gray-800/60 bg-[#0f0d0a]"
    >
      <div className="aspect-video relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #0f0d0a 0%, #1c1812 50%, #0f0d0a 100%)",
            animation: "shimmer 1.8s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Film size={28} className="text-gray-700" />
        </div>
      </div>
      <div className="p-5 bg-gradient-to-b from-[#14120f] to-[#0a0907]">
        <div className="h-4 w-2/3 rounded-full bg-gray-800/60 mb-2" />
        <div className="h-3 w-1/3 rounded-full bg-gray-800/40" />
      </div>
    </motion.div>
  );
}

function VideoCard({ video, index }: { video: VideoData; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [errored,   setErrored]   = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref      = useRef(null);
  const inView   = useInView(ref, { once: true, margin: "-50px" });
  const isTouchDevice = useRef(typeof window !== "undefined" && ("ontouchstart" in window));

  const play = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setIsPlaying(false);
  }, []);

  // Desktop: hover to play/pause
  const handleMouseEnter = () => { if (!isTouchDevice.current) play(); };
  const handleMouseLeave = () => { if (!isTouchDevice.current) pause(); };

  // Mobile: tap to toggle
  const handleTap = () => {
    if (!isTouchDevice.current) return;
    isPlaying ? pause() : play();
  };

  if (errored) {
    return (
      <motion.div
        ref={ref}
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="rounded-3xl overflow-hidden border border-gray-800/60 bg-[#0f0d0a] aspect-video flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <AlertCircle size={28} className="text-amber-500/30" />
          <span className="text-xs tracking-wide">Video unavailable</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="group"
    >
      <div
        className="relative overflow-hidden rounded-3xl border border-gray-800/80 hover:border-amber-500/40 transition-all duration-500 shadow-sm hover:shadow-[0_20px_50px_rgba(201,122,6,0.15)] cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTap}
      >
        {/* Cinematic 16:9 aspect ratio */}
        <div className="relative aspect-video bg-[#0f0d0a] overflow-hidden">
          {/* Fallback icon behind video */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Film size={32} className="text-gray-800" />
          </div>

          <video
            ref={videoRef}
            src={video.src}
            className={`absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 ${isPlaying ? "scale-105" : "scale-100"}`}
            muted
            playsInline
            loop
            preload="metadata"
            onError={() => setErrored(true)}
          />

          {/* Cinematic gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 z-20 pointer-events-none transition-opacity duration-500 ${isPlaying ? "opacity-60" : "opacity-100"}`} />

          {/* Play / Pause indicator */}
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <motion.div
              animate={{ opacity: isPlaying ? 0 : 1, scale: isPlaying ? 0.85 : 1 }}
              transition={{ duration: 0.3 }}
              className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-[0_0_30px_rgba(201,122,6,0.25)]"
            >
              {isPlaying
                ? <Pause size={18} className="text-white" fill="currentColor" />
                : <Play  size={18} className="text-white ml-0.5" fill="currentColor" />
              }
            </motion.div>
          </div>

          {/* MOV warning badge */}
          {video.isMov && (
            <div className="absolute top-3 right-3 z-30 bg-orange-500/85 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-[0.6rem] font-bold flex items-center gap-1 shadow-lg">
              <AlertCircle size={10} /> MOV
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-30">
            <span className="text-white text-[0.62rem] font-bold tracking-[0.18em] uppercase bg-amber-600/85 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-amber-500/40">
              {video.category.replace(/-/g, " ")}
            </span>
          </div>
        </div>

        {/* Card footer */}
        <div className="px-5 py-4 bg-gradient-to-b from-[#14120f] to-[#0a0907] flex items-center justify-between">
          <div className="min-w-0">
            <h3
              className="text-sm font-semibold text-gray-200 group-hover:text-amber-400 transition-colors duration-300 truncate"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {video.filename.replace(/\.[^.]+$/, "").replace(/-/g, " ")}
            </h3>
            <p className="text-[0.65rem] text-gray-600 mt-0.5 tracking-wide uppercase">
              {isPlaying ? "Playing…" : "Hover / Tap to play"}
            </p>
          </div>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-3 transition-all duration-300 ${isPlaying ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" : "bg-gray-700"}`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function VideoGallery() {
  const [videos,  setVideos]  = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocalVideos()
      .then(setVideos)
      .catch((e) => console.error("VideoGallery:", e))
      .finally(() => setLoading(false));
  }, []);

  // Don't render section at all if no videos
  if (!loading && videos.length === 0) return null;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: CB }}
        className="mb-12"
      >
        <span className="inline-block text-[0.68rem] font-bold tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full text-amber-400 bg-amber-500/10 border border-amber-500/20">
          Cinematic Films
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Experience the Motion
        </h2>
        <p className="text-gray-500 max-w-xl text-base leading-relaxed">
          {loading
            ? "Loading films…"
            : `${videos.length} cinematic ${videos.length === 1 ? "film" : "films"} — hover to preview, click to play on mobile.`}
        </p>
      </motion.div>

      {/* MOV warning */}
      {!loading && videos.some(v => v.isMov) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-2xl bg-orange-950/40 border border-orange-500/25 text-orange-200/80 text-sm flex gap-3 items-start max-w-2xl"
        >
          <AlertCircle className="flex-shrink-0 mt-0.5 text-orange-400" size={16} />
          <p>
            <strong>Some videos are in .MOV format</strong> which may not play on all browsers.
            Run <code className="bg-black/30 px-1.5 py-0.5 rounded text-orange-300 text-xs">node scripts/optimize-videos.mjs</code> to convert them.
          </p>
        </motion.div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <VideoSkeleton key={i} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {videos.map((video, index) => (
            <VideoCard key={video.src} video={video} index={index} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
