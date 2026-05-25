"use client";

import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { events, heroImages } from "@/lib/data";
import Link from "next/link";
import CloudinaryImage from "@/components/CloudinaryImage";
import CloudinaryVideo from "@/components/CloudinaryVideo";
import {
  Youtube,
  Mail,
  Phone,
  Send,
  Facebook,
  Linkedin,
  Instagram,
  MessageCircle,
  ChevronDown,
  Aperture,
  Camera,
  Film,
  Play,
  ArrowRight,
  Star,
  Quote,
  Sparkles,
  Award,
  Heart,
  Eye,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    quote:
      "Deehar Productions didn't just photograph our wedding — they crafted a visual masterpiece. Every frame pulses with emotion; we relive the entire day every time we watch it.",
    name: "Priya & Arjun",
    event: "Wedding",
    location: "Bengaluru",
    stars: 5,
  },
  {
    quote:
      "From the golden hour portraits to the last dance, every moment was captured with such artistry and care. Our families still gather to watch the film on every anniversary.",
    name: "Sneha & Rahul",
    event: "Wedding & Reception",
    location: "Mysore",
    stars: 5,
  },
  {
    quote:
      "The baby shower photographs are breathtaking. They found tenderness and magic in moments I didn't even notice were happening. Truly a gift we'll treasure forever.",
    name: "Kavya Sharma",
    event: "Baby Shower",
    location: "Bengaluru",
    stars: 5,
  },
];

const marqueeItems = [
  "Weddings",
  "Portraits",
  "Baby Showers",
  "Naming Ceremonies",
  "Engagements",
  "Anniversaries",
  "Corporate Events",
  "Cinematic Films",
];

const whyItems = [
  {
    icon: Eye,
    title: "Artistic Vision",
    desc: "Every shoot is treated as a fine-art project — light, composition, and emotion all considered.",
  },
  {
    icon: Heart,
    title: "Personal Touch",
    desc: "We take time to understand your story so the final images feel authentically yours.",
  },
  {
    icon: Award,
    title: "8+ Years Experience",
    desc: "Over 200 events captured with professional-grade equipment and a seasoned creative eye.",
  },
  {
    icon: Sparkles,
    title: "Cinematic Quality",
    desc: "Cinema-grade videography and photography that makes every frame worth framing.",
  },
];

// Typed cubic-bezier tuple — required by Framer Motion v12's stricter Variants types
const CB: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: CB } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 44, scale: 0.96 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.1, ease: CB },
  }),
};

function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`ambient-orb pointer-events-none ${className}`}
      animate={{ y: [0, -20, 0], x: [0, 9, 0], scale: [1, 1.04, 1] }}
      transition={{ duration: 10 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      aria-hidden="true"
    />
  );
}

export function ServiceCard({ event, index }: { event: any; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="service-card h-full flex flex-col group"
    >
      <Link href={`/events/${event.slug}`} className="cursor-pointer h-full flex flex-col">
        <div className="relative h-64 w-full overflow-hidden">
          <CloudinaryImage
            src={event.coverImage}
            alt={event.title}
            fill
            crop="fill"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
            <span className="text-white text-[0.62rem] font-bold tracking-[0.2em] uppercase bg-amber-600/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {event.title}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-[0.7rem] font-bold tracking-[0.22em] uppercase bg-black/35 backdrop-blur-sm px-5 py-2 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
              View Gallery
            </span>
          </div>
        </div>
        <div className="p-6 text-center flex-grow flex flex-col justify-between relative z-10">
          <div>
            <h3
              className="text-lg font-bold mb-2 text-gray-900 group-hover:text-amber-700 transition-colors duration-300"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{event.shortDesc}</p>
          </div>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center text-amber-600 text-[0.72rem] font-bold tracking-widest uppercase gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Explore <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SectionHeader({
  label,
  title,
  subtitle,
  light = false,
}: {
  label: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-14 md:mb-18"
    >
      <span
        className={`inline-block text-xs font-bold tracking-[0.28em] uppercase mb-4 px-4 py-1.5 rounded-full ${
          light
            ? "text-amber-300 bg-amber-500/10 border border-amber-500/20"
            : "text-amber-700 bg-amber-50 border border-amber-100"
        }`}
      >
        {label}
      </span>
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-[1.12] ${
          light ? "text-white" : "text-gray-900"
        }`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg max-w-xl mx-auto leading-relaxed ${
            light ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {subtitle}
        </p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto mt-6 h-px w-20 ${light ? "bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"}`}
        style={{ transformOrigin: "center" }}
      />
    </motion.div>
  );
}

function FloatingInput({
  type = "text",
  name,
  label,
  required,
}: {
  type?: string;
  name: string;
  label: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="form-group relative">
      <input
        type={type}
        name={name}
        required={required}
        placeholder=" "
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(e.target.value.length > 0); }}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        className="form-input pt-6 pb-2"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
      <label
        className="form-label"
        style={{
          top: focused || hasValue ? "10px" : "50%",
          transform: focused || hasValue ? "translateY(0)" : "translateY(-50%)",
          fontSize: focused || hasValue ? "0.72rem" : "0.95rem",
          color: focused ? "var(--accent-amber-light)" : hasValue ? "var(--accent-amber-light)" : "rgba(255,255,255,0.4)",
          letterSpacing: focused || hasValue ? "0.04em" : "normal",
          fontWeight: focused || hasValue ? "500" : "400",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {label}
      </label>
    </div>
  );
}

function FloatingTextarea({ name, label, required }: { name: string; label: string; required?: boolean }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="form-group relative">
      <textarea
        name={name}
        required={required}
        placeholder=" "
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(e.target.value.length > 0); }}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        className="form-textarea"
        rows={4}
      />
      <label
        className="form-label-textarea"
        style={{
          top: focused || hasValue ? "8px" : "16px",
          fontSize: focused || hasValue ? "0.72rem" : "0.95rem",
          color: focused ? "var(--accent-amber-light)" : hasValue ? "var(--accent-amber-light)" : "rgba(255,255,255,0.4)",
          letterSpacing: focused || hasValue ? "0.04em" : "normal",
          fontWeight: focused || hasValue ? "500" : "400",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
          position: "absolute",
          left: "18px",
        }}
      >
        {label}
      </label>
    </div>
  );
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center lg:text-left"
    >
      <span
        className="block text-2xl md:text-3xl font-bold text-white leading-none"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {value}
      </span>
      <span className="text-[0.62rem] text-gray-500 tracking-[0.2em] uppercase font-medium mt-1 block">
        {label}
      </span>
    </motion.div>
  );
}

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const chunkedEvents: typeof events[] = [];
  for (let i = 0; i < events.length; i += 3) {
    chunkedEvents.push(events.slice(i, i + 3));
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen flex flex-col overflow-x-hidden">
      <section
        ref={heroRef}
        className="relative w-full min-h-screen flex overflow-hidden bg-[#0C0A07]"
      >
        <FloatingOrb className="w-[700px] h-[700px] -bottom-40 -right-40 bg-amber-600/12 z-0" delay={0} />
        <FloatingOrb className="w-[400px] h-[400px] top-10 left-1/4 bg-amber-500/7 z-0" delay={3} />
        <FloatingOrb className="w-[300px] h-[300px] bottom-1/4 left-8 bg-amber-700/8 z-0" delay={6} />

        {/* Top gradient — ensures transparent navbar is always readable */}
        <div
          className="absolute top-0 left-0 right-0 h-40 z-[3] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)" }}
          aria-hidden="true"
        />

        <div className="hero-noise z-[1]" />

        <div
          className="absolute inset-0 z-[1] opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        <div
          className="absolute top-0 right-[30%] w-px h-full z-[2] opacity-[0.06]"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(217,119,6,0.8), transparent)" }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 lg:hidden z-[2]">
          <AnimatePresence mode="sync">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <CloudinaryImage
                src={heroImages[currentImage]}
                alt="Deehar Production"
                fill
                priority
                crop="fill"
                gravity="face"
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-14 flex flex-col lg:flex-row items-center min-h-screen gap-8 lg:gap-0">
          <motion.div
            className="flex flex-col justify-center w-full lg:w-[54%] xl:w-[52%] py-28 lg:py-0 lg:pr-12 xl:pr-20 text-center lg:text-left"
            style={{ opacity: heroOpacity }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center lg:items-start"
            >
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2.5 text-amber-400 text-[0.68rem] font-bold tracking-[0.3em] uppercase mb-8 px-5 py-2 rounded-full bg-white/8 backdrop-blur-sm border border-white/15">
                  <Aperture size={10} className="animate-spin" style={{ animationDuration: "10s" }} />
                  Premium Photography & Videography
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-[4.5rem] font-bold text-white mb-6 leading-[1.06] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Capturing Life&apos;s{" "}
                <motion.span
                  className="gradient-text-amber italic block"
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  Best Moments
                </motion.span>
              </motion.h1>

              <motion.div
                variants={itemVariants}
                className="hidden lg:block w-14 h-px bg-gradient-to-r from-amber-500/70 to-transparent mb-7"
              />

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-gray-300/85 max-w-[380px] mx-auto lg:mx-0 leading-relaxed mb-10"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1.1rem" }}
              >
                Professional photography and videography for your most cherished events — told with artistry and heart.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start mb-14 w-full sm:w-auto"
              >
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/#services"
                    className="hero-btn-primary inline-flex items-center justify-center gap-2.5 w-full sm:w-auto"
                  >
                    <Camera size={15} />
                    View Our Work
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/#contact"
                    className="hero-btn-ghost inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Book a Session
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-6 md:gap-9 justify-center lg:justify-start"
              >
                {[
                  { value: "200+", label: "Events" },
                  { value: "5★", label: "Rating" },
                  { value: "8+", label: "Years" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-6 md:gap-9">
                    <AnimatedStat value={stat.value} label={stat.label} />
                    {i < 2 && <div className="w-px h-8 bg-white/10" />}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="hidden lg:flex relative w-[46%] xl:w-[48%] h-full items-center justify-center py-16">
            <motion.div
              className="hero-main-image-card relative w-[310px] xl:w-[360px] h-[460px] xl:h-[530px] rounded-[30px] overflow-hidden shadow-[0_36px_90px_rgba(0,0,0,0.65)] border border-white/8"
              initial={{ opacity: 0, x: 48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: heroY }}
            >
              <AnimatePresence mode="sync">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <CloudinaryImage
                    src={heroImages[currentImage]}
                    alt="Deehar Production showcase"
                    fill
                    priority
                    crop="fill"
                    gravity="face"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`rounded-full transition-all duration-500 ${
                      i === currentImage ? "w-6 h-1.5 bg-amber-400" : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="absolute top-14 xl:top-18 left-2 xl:-left-2 w-[125px] xl:w-[145px] h-[165px] xl:h-[188px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/8"
              initial={{ opacity: 0, x: -24, y: 22 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ animation: "float 9s ease-in-out infinite" }}
            >
              <CloudinaryImage
                src={heroImages[(currentImage + 1) % heroImages.length]}
                alt="Event preview"
                fill
                crop="fill"
                gravity="face"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/18" />
            </motion.div>

            <motion.div
              className="absolute bottom-18 xl:bottom-22 -left-2 xl:-left-6 bg-white/8 backdrop-blur-xl rounded-2xl p-4 border border-white/12 shadow-2xl"
              initial={{ opacity: 0, x: -22, y: 22 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/18 flex items-center justify-center">
                  <Star size={14} className="text-amber-400" fill="currentColor" />
                </div>
                <div>
                  <span className="text-white text-sm font-bold block leading-none">5.0 Rating</span>
                  <span className="text-gray-400 text-xs tracking-wide">200+ happy clients</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute right-0 xl:-right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.9 }}
            >
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-500/35 to-transparent" />
              <span
                className="text-amber-500/25 text-[0.58rem] tracking-[0.38em] uppercase font-medium"
                style={{ writingMode: "vertical-rl" }}
              >
                Since 2016
              </span>
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-500/35 to-transparent" />
            </motion.div>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 55% 45% at 58% 50%, rgba(201,122,6,0.10), transparent)",
              }}
            />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 lg:hidden">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`rounded-full transition-all duration-500 ${
                i === currentImage ? "w-7 h-1.5 bg-amber-400" : "w-1.5 h-1.5 bg-white/35"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <motion.div
          className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.7 }}
        >
          <span className="text-[0.52rem] text-white/25 tracking-[0.24em] uppercase" style={{ writingMode: "vertical-rl" }}>
            Scroll
          </span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
            <ChevronDown size={13} className="text-white/25" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Minimalist Marquee Ticker ─────────────────────────────────── */}
      <div className="marquee-section py-4 overflow-hidden" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 px-10 text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-white/40"
            >
              <span>{item}</span>
              <span className="w-1 h-1 rounded-full bg-amber-500/30 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      <section id="services" className="relative max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.035] pointer-events-none"
          style={{ background: "radial-gradient(circle, #D97706, transparent)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-[0.025] pointer-events-none"
          style={{ background: "radial-gradient(circle, #D97706, transparent)" }}
          aria-hidden="true"
        />

        <SectionHeader
          label="Our Services"
          title="Every Moment, Masterfully Told"
          subtitle="We specialize in turning fleeting moments into timeless visual stories — crafted with precision, passion, and an artist's eye."
        />

        {chunkedEvents.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {group.map((event, index) => (
                <ServiceCard key={event.slug} event={event} index={index} />
              ))}
            </div>

            {groupIndex < chunkedEvents.length - 1 && (
              <div className="py-16 flex items-center gap-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="relative py-20 md:py-28 bg-[#FDFBF7] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.018] pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            label="Why Deehar"
            title="Craftsmanship in Every Frame"
            subtitle="We don't just take pictures — we build a lasting visual legacy for your most treasured milestones."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {whyItems.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="why-card group"
              >
                <div className="why-icon-wrap group-hover:scale-110 transition-transform duration-400">
                  <item.icon size={20} />
                </div>
                <h3
                  className="text-base font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clean Quote Section ──────────────────────────────────── */}
      <section className="dark-section relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex justify-center mb-8">
              <Film size={24} className="text-amber-500/40" />
            </div>

            <blockquote
              className="text-2xl md:text-[2rem] lg:text-[2.2rem] text-white/90 font-light leading-[1.6] mb-10 tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              &ldquo;Every photograph is a certificate of presence — a moment held forever against the tide of time.&rdquo;
            </blockquote>

            <p className="text-amber-500/60 text-[0.7rem] tracking-[0.3em] uppercase font-bold">
              Deehar Productions &nbsp;·&nbsp; Est. 2016
            </p>
          </motion.div>
        </div>
      </section>

      <section className="dark-section relative py-20 md:py-28 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10">
          <SectionHeader
            label="Client Stories"
            title="Moments That Move Hearts"
            subtitle="Hear from families and couples whose memories we had the privilege to preserve."
            light
          />

          <div className="relative min-h-[260px] flex items-center justify-center mb-10">
            <AnimatePresence mode="wait">
              {testimonials.map((t, i) =>
                i === activeTestimonial ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-2"
                  >
                    <Quote size={22} className="text-amber-500/30 mb-7" />
                    <p
                      className="text-lg md:text-xl lg:text-[1.25rem] text-white/90 font-light leading-[1.6] mb-8 max-w-2xl"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.stars }).map((_, si) => (
                          <Star key={si} size={11} className="text-amber-400" fill="currentColor" />
                        ))}
                      </div>
                      <div className="w-px h-4 bg-white/15" />
                      <span
                        className="text-white/80 text-sm font-semibold"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {t.name}
                      </span>
                      <span className="text-gray-500 text-[0.72rem] tracking-wide">
                        {t.event} · {t.location}
                      </span>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-500 ${
                  activeTestimonial === i
                    ? "w-8 h-1.5 bg-amber-400"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.3 }}
            className="mt-16 h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent"
          />
        </div>
      </section>

      <footer className="dark-section relative overflow-hidden" id="contact">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-amber-500 text-[0.68rem] font-bold tracking-[0.28em] uppercase mb-4 block">Get in Touch</span>
            <h2
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Let&apos;s Create Together
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 300 }}>
              Have a project in mind? Reach out — we&apos;d love to hear about your vision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col justify-center"
            >
              <h3 className="text-xl font-semibold mb-7 text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                Find Me
              </h3>

              <div className="space-y-4 mb-8">
                <div className="contact-item">
                  <div className="contact-icon-wrap"><Mail size={17} /></div>
                  <div>
                    <p className="text-xs text-gray-500 tracking-wide uppercase mb-0.5">Email</p>
                    <a href="mailto:deeharproductions@gmail.com" className="text-gray-200 hover:text-amber-400 transition-colors text-sm">
                      deeharproductions@gmail.com
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon-wrap"><Phone size={17} /></div>
                  <div>
                    <p className="text-xs text-gray-500 tracking-wide uppercase mb-0.5">Mobile</p>
                    <a href="tel:+918123104523" className="text-gray-200 hover:text-amber-400 transition-colors text-sm">
                      +91-8123104523
                    </a>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/8123104523"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn w-fit mb-10"
              >
                <MessageCircle size={17} className="mr-2.5" />
                Chat on WhatsApp
              </a>

              <div>
                <p className="text-xs text-gray-600 tracking-[0.22em] uppercase mb-4 font-medium">Follow Along</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <a href="https://www.linkedin.com/in/deehar-productions-11b90b372" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                    <Linkedin size={16} />
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61565882062655" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                    <Facebook size={16} />
                  </a>
                  <a href="https://www.instagram.com/deehar_weddings?igsh=MW10bHMyN2llamR5cw==" target="_blank" rel="noopener noreferrer" className="social-icon social-icon-instagram" aria-label="Instagram">
                    <Instagram size={16} />
                  </a>
                  <a href="#" className="social-icon" aria-label="YouTube">
                    <Youtube size={16} />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="form-card p-8 shadow-2xl">
                <h3 className="text-lg font-semibold mb-7 text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Send a Message
                </h3>
                <form
                  action="https://formspree.io/f/maqkozzz"
                  method="POST"
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FloatingInput name="name" label="Your Name" required />
                    <FloatingInput type="email" name="email" label="Email Address" required />
                  </div>
                  <FloatingTextarea name="message" label="Your Message" required />

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-amber w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold"
                  >
                    Send Message <Send size={14} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 pt-8 border-t border-white/[0.055] flex flex-col sm:flex-row justify-between items-center gap-3"
          >
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Deehar Productions. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm">
              Designed & developed by{" "}
              <a
                href="https://sharath-holla.github.io/my_portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 transition-colors font-medium"
              >
                Sharath NS
              </a>
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}