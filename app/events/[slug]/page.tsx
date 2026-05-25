"use client";

import { events } from "@/lib/data";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { use, useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import CloudinaryImage from "@/components/CloudinaryImage";
import CloudinaryVideo from "@/components/CloudinaryVedio";

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")  setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length, onClose]);

  // Lock scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/96 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-white/60 hover:text-amber-400 transition-colors z-[110] p-2"
        aria-label="Close lightbox"
      >
        <X size={36} />
      </button>

      {/* Counter */}
      <span className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase z-[110]">
        {index + 1} / {images.length}
      </span>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + images.length) % images.length); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-amber-400 transition-colors z-[110] p-3 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-sm"
        aria-label="Previous image"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % images.length); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-amber-400 transition-colors z-[110] p-3 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-sm"
        aria-label="Next image"
      >
        <ChevronRight size={28} />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-6xl h-[88vh] px-16 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <CloudinaryImage
            src={images[index]}
            alt={`Gallery image ${index + 1}`}
            fill
            crop="fit"
            className="object-contain"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Thumbnail strip */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-[90vw] overflow-x-auto pb-1 scrollbar-hide z-[110]">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIndex(i); }}
            className={`relative flex-shrink-0 w-12 h-9 rounded-md overflow-hidden border-2 transition-all duration-200 ${
              i === index ? "border-amber-400 opacity-100" : "border-white/10 opacity-40 hover:opacity-70"
            }`}
            aria-label={`Thumbnail ${i + 1}`}
          >
            <CloudinaryImage src={img} alt="" fill crop="fill" className="object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const event = events.find((e) => e.slug === resolvedParams.slug);

  const [heroIndex, setHeroIndex]       = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Auto-advance hero slideshow
  useEffect(() => {
    if (!event) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % event.gallery.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [event]);

  if (!event) {
    notFound();
    return null;
  }

  return (
    <div className="min-h-screen pb-28 bg-[#FDFBF7]">

      {/* ── Hero Slideshow ──────────────────────────────────────────────────── */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-gray-950">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {/* Blurred background */}
            <div className="absolute inset-0 scale-125">
              <CloudinaryImage
                src={event.gallery[heroIndex] || event.coverImage}
                alt=""
                fill
                crop="fill"
                className="object-cover blur-[40px] opacity-40"
              />
            </div>

            {/* Crisp foreground image */}
            <div className="absolute inset-0 pb-28 md:pb-36 pt-8 px-4">
              <CloudinaryImage
                src={event.gallery[heroIndex] || event.coverImage}
                alt={event.title}
                fill
                crop="fit"
                priority={heroIndex === 0}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent z-10 pointer-events-none" />

        {/* Title */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end items-center pb-10 md:pb-16 px-6 pointer-events-none">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold text-white text-center tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {event.title}
          </motion.h1>
          <p className="text-gray-400 text-sm mt-4 tracking-widest uppercase">
            {event.gallery.length} photos{event.videoUrls.length > 0 ? ` · ${event.videoUrls.length} film${event.videoUrls.length > 1 ? "s" : ""}` : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20">

        {/* ── Gallery Grid ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2
            className="text-4xl font-bold mb-12 text-center text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gallery
          </h2>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {event.gallery.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLightboxIndex(index)}
                className="relative break-inside-avoid rounded-xl overflow-hidden shadow-md group cursor-zoom-in bg-gray-200 aspect-[3/4]"
              >
                <CloudinaryImage
                  src={img}
                  alt={`${event.title} — photo ${index + 1}`}
                  fill
                  crop="fill"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                {/* Index badge */}
                <span className="absolute bottom-2 right-2 text-white/50 text-[0.6rem] tracking-widest bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {index + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Videos Section ───────────────────────────────────────────────── */}
        {event.videoUrls && event.videoUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2
              className="text-4xl font-bold mb-12 text-center text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Cinematic Highlights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {event.videoUrls.map((publicId, index) => (
                <CloudinaryVideo
                  key={index}
                  src={publicId}
                  controls
                  className="rounded-2xl overflow-hidden shadow-2xl aspect-video"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={event.gallery}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}