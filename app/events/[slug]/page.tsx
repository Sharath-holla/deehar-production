"use client";

import { events } from "@/lib/data";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { use, useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")  setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length, onClose]);

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
        className="absolute top-5 right-6 text-white/60 hover:text-amber-400 transition-colors z-[110] p-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm"
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      {/* Counter */}
      <span className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase z-[110] bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full">
        {index + 1} / {images.length}
      </span>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + images.length) % images.length); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-amber-400 transition-colors z-[110] p-3 bg-white/5 hover:bg-white/12 rounded-full backdrop-blur-sm border border-white/10 hover:border-amber-500/30"
        aria-label="Previous image"
      >
        <ChevronLeft size={26} />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % images.length); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-amber-400 transition-colors z-[110] p-3 bg-white/5 hover:bg-white/12 rounded-full backdrop-blur-sm border border-white/10 hover:border-amber-500/30"
        aria-label="Next image"
      >
        <ChevronRight size={26} />
      </button>

      {/*
        LIGHTBOX IMAGE
        crop="fit" + object-contain = full image always visible, no cropping.
        The blurred background fills negative space beautifully.
      */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-5xl h-[85vh] px-14 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Blurred background fill (no empty black bars) */}
          <div className="absolute inset-0 px-14 overflow-hidden opacity-25">
            <CloudinaryImage
              src={images[index]}
              alt=""
              fill
              crop="fill"
              className="object-cover blur-3xl scale-110"
            />
          </div>

          {/* Crisp full image */}
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
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-[90vw] overflow-x-auto pb-1 z-[110]"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIndex(i); }}
            className={`relative flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${
              i === index
                ? "w-14 h-10 border-amber-400 opacity-100"
                : "w-11 h-8 border-white/10 opacity-35 hover:opacity-65 hover:border-white/25"
            }`}
            aria-label={`Thumbnail ${i + 1}`}
          >
            {/* Thumbnails are small UI elements — fill+fill is fine here */}
            <CloudinaryImage src={img} alt="" fill crop="fill" className="object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Gallery Card ─────────────────────────────────────────────────────────────
/*
  GALLERY GRID IMAGE STRATEGY
  ─────────────────────────────────────────────────────────────────────────────
  Each card has:
  - A dark cinematic background
  - crop="fit" so Cloudinary never clips the image
  - object-contain so the browser never clips the image
  - A fixed aspect-ratio container so the grid stays uniform

  We alternate aspect ratios across the grid to create a professional
  editorial/masonry feel while keeping rows visually balanced.
  ─────────────────────────────────────────────────────────────────────────────
*/
function GalleryCard({
  img,
  index,
  eventTitle,
  onClick,
}: {
  img: string;
  index: number;
  eventTitle: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.04, 0.35), duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl cursor-zoom-in shadow-md hover:shadow-2xl transition-shadow duration-500"
      style={{
        background: "linear-gradient(145deg, #0f0d0a, #1a1612)",
        aspectRatio: "4 / 3",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(201,122,6,0.05), transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Full image — no cropping */}
      <CloudinaryImage
        src={img}
        alt={`${eventTitle} — photo ${index + 1}`}
        fill
        crop="fit"
        className="object-contain transition-transform duration-700 group-hover:scale-[1.04] z-[1]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-400 z-[2]" />

      {/* Index badge */}
      <span className="absolute bottom-2 right-2.5 text-white/55 text-[0.6rem] tracking-widest bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[3]">
        {index + 1}
      </span>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const event = events.find((e) => e.slug === resolvedParams.slug);

  const [heroIndex, setHeroIndex]         = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
      <div className="relative w-full h-[60vh] md:h-[78vh] overflow-hidden bg-[#080604]">

        <AnimatePresence mode="popLayout">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="absolute inset-0"
          >
            {/*
              HERO IMAGE STRATEGY
              Blurred fill background + sharp contained foreground.
              The background gives a rich cinematic color wash.
              The foreground shows the FULL image without any crop.
            */}

            {/* Blurred background (fills the frame with color) */}
            <div className="absolute inset-0 scale-110">
              <CloudinaryImage
                src={event.gallery[heroIndex] || event.coverImage}
                alt=""
                fill
                crop="fill"
                className="object-cover blur-2xl opacity-35 saturate-150"
              />
            </div>

            {/* Crisp foreground — full image, no crop */}
            <div className="absolute inset-0 px-6 md:px-16 pb-28 md:pb-36 pt-10">
              <CloudinaryImage
                src={event.gallery[heroIndex] || event.coverImage}
                alt={event.title}
                fill
                crop="fit"
                priority={heroIndex === 0}
                className="object-contain drop-shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080604] via-[#080604]/40 to-transparent z-10 pointer-events-none" />

        {/* Slideshow dots — encapsulated inside a beautiful glassmorphic container with larger mobile touch targets */}
        <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/40 backdrop-blur-xl px-4.5 py-2.5 rounded-full border border-white/8 shadow-2xl">
          {event.gallery.slice(0, Math.min(event.gallery.length, 8)).map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`transition-all duration-500 rounded-full ${
                i === heroIndex
                  ? "w-6 h-2 bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.65)]"
                  : "w-2 h-2 bg-white/25 hover:bg-white/55"
              }`}
              style={{ touchAction: "manipulation" }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Title & metadata pill */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end items-center pb-8 md:pb-12 px-6 pointer-events-none">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-6xl lg:text-7xl font-extrabold text-white text-center tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}
          >
            {event.title}
          </motion.h1>
          
          {/* Futuristic minimalist metadata pill instead of crude plain photos text */}
          <div className="mt-4 flex items-center gap-2 bg-white/6 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[0.6rem] text-gray-300 font-bold uppercase tracking-[0.24em] leading-none">
              Exclusive Showcase
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-16 md:mt-20">

        {/* ── Gallery Grid ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-12 justify-center">
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <div className="flex items-center gap-2.5">
              <Images size={16} className="text-amber-500/60" />
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Gallery
              </h2>
            </div>
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent via-amber-500/30 to-transparent" />
          </div>

          {/*
            GRID LAYOUT
            3 columns on desktop, 2 on tablet, 1 on mobile.
            Each card has a fixed 4:3 aspect ratio and uses crop=fit + object-contain
            so EVERY image — portrait, landscape, square — displays fully without cropping.
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {event.gallery.map((img, index) => (
              <GalleryCard
                key={index}
                img={img}
                index={index}
                eventTitle={event.title}
                onClick={() => setLightboxIndex(index)}
              />
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
            <div className="flex items-center gap-4 mb-12 justify-center">
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Cinematic Highlights
              </h2>
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent via-amber-500/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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