"use client";

import { DM_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Menu, X, Aperture } from "lucide-react";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

const navLinks = [
  { href: "/",          label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#contact",  label: "Contact" },
];

/* ──────────────────────────────────────────────────────────────
   LOGO — Interactive 3D Parallax & Metallic Sheen Logo
────────────────────────────────────────────────────────────── */
function Logo({ scrolled }: { scrolled: boolean }) {
  const [imgError, setImgError] = useState(false);
  const containerRef = useRef<HTMLAnchorElement>(null);

  // 3D rotation vectors
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // High-performance spring physics for buttery smooth motion
  const rotateX = useSpring(useTransform(y, [-40, 40], [16, -16]), { stiffness: 160, damping: 14 });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-16, 16]), { stiffness: 160, damping: 14 });

  // Dynamic light/reflection shine sweep
  const shineX = useSpring(useTransform(x, [-40, 40], ["-150%", "150%"]), { stiffness: 160, damping: 14 });

  // Dynamic shadow casting that matches the tilt direction
  const shadowX = useTransform(x, [-40, 40], [6, -6]);
  const shadowY = useTransform(y, [-40, 40], [6, -6]);

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 80;
    const mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 80;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link
      href="/"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex items-center gap-3.5 group relative"
      aria-label="Deehar Productions Home"
      style={{ perspective: 1000 }}
    >
      {/* 3D Rotating Badge Wrapper */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="flex items-center gap-3.5"
      >
        
        {/* ── Logo Icon Container ── */}
        <motion.div
          className="relative flex-shrink-0 relative overflow-hidden rounded-xl bg-white/4 border border-white/10 p-1 flex items-center justify-center shadow-2xl transition-all duration-300"
          style={{
            transform: "translateZ(30px)",
            transformStyle: "preserve-3d",
            boxShadow: `0 10px 30px rgba(0,0,0,0.65)`,
          }}
        >
          {/* Metallic gloss sheen effect sliding across */}
          <motion.div
            className="absolute inset-y-0 w-[50%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/28 to-transparent pointer-events-none z-[3]"
            style={{ left: shineX }}
          />

          {!imgError ? (
            /* Try to load the PNG; fall back to icon if missing */
            <div className="relative w-10 h-10 md:w-11 md:h-11">
              <img
                src="/photos/Deehar.png"
                alt="Deehar Productions Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)]"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            /* Elegant icon fallback when PNG not found */
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-amber-500/25 to-amber-700/20 flex items-center justify-center">
              <Aperture
                size={22}
                className="text-amber-400 animate-spin-slow"
                style={{ filter: "drop-shadow(0 0 8px rgba(245,158,11,0.65))" }}
              />
            </div>
          )}
        </motion.div>

        {/* ── Typographic Branding Text ── */}
        <motion.div
          className="flex flex-col leading-none"
          style={{
            transform: "translateZ(18px)",
            transformStyle: "preserve-3d",
          }}
        >
          <span
            className="font-bold tracking-widest text-white uppercase text-base md:text-lg group-hover:text-amber-400 transition-colors duration-300"
            style={{
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "0.15em",
              textShadow: "0 2px 12px rgba(0,0,0,0.85), 0 0 35px rgba(255,255,255,0.06)",
            }}
          >
            Deehar
          </span>
          <span
            className="text-[0.52rem] tracking-[0.32em] text-amber-400 uppercase font-semibold font-mono-custom mt-1"
            style={{
              textShadow: "0 0 14px rgba(245,158,11,0.5)",
            }}
          >
            Productions
          </span>
        </motion.div>

      </motion.div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────
   NAVBAR
────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onHashChange = () => setMobileOpen(false);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`
          sticky top-0 z-50 transition-all duration-500
          ${scrolled
            ? "navbar-glass py-2.5"
            : "navbar-transparent py-4"
          }
        `}
      >
        {/* Thin amber accent line at very top — only visible when scrolled */}
        {scrolled && (
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        )}

        <div className="max-w-7xl mx-auto px-5 md:px-10 flex justify-between items-center">

          {/* ── Logo ── */}
          <Logo scrolled={scrolled} />

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className="nav-link relative px-4 py-2 text-sm rounded-lg hover:bg-white/8 transition-colors duration-200"
              >
                {link.label}
                {activeLink === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-amber-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
              </Link>
            ))}

            {/* Book Now CTA */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="ml-3">
              <Link
                href="/#contact"
                id="navbar-book-now"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-xl tracking-widest uppercase transition-all duration-300 shadow-[0_0_22px_rgba(245,158,11,0.45)] hover:shadow-[0_0_32px_rgba(245,158,11,0.65)] block"
                style={{ letterSpacing: "0.08em" }}
              >
                Book Now
              </Link>
            </motion.div>
          </nav>

          {/* ── Mobile Toggle ── */}
          <motion.button
            id="mobile-menu-toggle"
            className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-menu sticky top-[60px] z-40 overflow-hidden"
          >
            <nav
              className="max-w-7xl mx-auto px-5 py-5 flex flex-col gap-1"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => { setMobileOpen(false); setActiveLink(link.href); }}
                    className="flex items-center px-4 py-3.5 rounded-xl text-gray-200 hover:text-amber-400 hover:bg-white/6 transition-all duration-200 font-medium text-sm tracking-wide border border-transparent hover:border-amber-500/15"
                  >
                    {link.label}
                    {activeLink === link.href && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Book Now */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.07, duration: 0.3 }}
                className="mt-3"
              >
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex justify-center px-4 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-bold text-xs tracking-widest uppercase transition-all hover:from-amber-500 hover:to-amber-400 active:scale-95 shadow-[0_4px_16px_rgba(201,122,6,0.4)]"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Book a Session
                </Link>
              </motion.div>

              {/* Divider */}
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
              <p className="text-center text-[0.6rem] text-gray-600 tracking-[0.2em] uppercase pt-2">
                Deehar Productions · Est. 2016
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
────────────────────────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="progress-line"
      style={{ scaleX, transformOrigin: "0%" }}
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   ROOT LAYOUT
────────────────────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Deehar Productions — Premium Photography &amp; Videography Studio</title>
        <meta name="description" content="Deehar Productions — Professional cinematic photography and videography for weddings, portraits, baby showers, corporate events and more. Based in Bengaluru, serving across Karnataka." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0C0A07" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${dmSans.className} bg-[#FDFBF7] text-gray-800 antialiased flex flex-col min-h-screen`}
        style={{ overflowX: "hidden" }}
      >
        {/* Cinematic film-grain overlay — defined in globals.css */}
        <div className="grain-overlay" aria-hidden="true" />
        {/* Scroll progress bar */}
        <ScrollProgress />
        {/* Navbar */}
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}