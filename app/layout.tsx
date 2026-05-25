"use client";

import { DM_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

const navLinks = [
  { href: "/",          label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#contact",  label: "Contact" },
];

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

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`
          sticky top-0 z-50 transition-all duration-500
          ${scrolled
            ? "navbar-glass shadow-sm py-2"
            : "bg-[#FDFBF7]/50 backdrop-blur-sm py-3"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex justify-between items-center">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={() => setActiveLink("/")}
          >
            <motion.div
              className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0"
              whileHover={{ rotate: [0, -4, 4, 0], scale: 1.06 }}
              transition={{ duration: 0.45 }}
            >
              <Image
                src="/photos/Deehar.png"
                alt="Deehar Production Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span
                className="font-bold tracking-widest text-gray-900 uppercase text-base md:text-lg group-hover:text-amber-700 transition-colors duration-300"
                style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.14em" }}
              >
                Deehar
              </span>
              <span className="text-[0.56rem] tracking-[0.28em] text-amber-600 uppercase font-semibold font-mono-custom mt-0.5">
                Productions
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className="nav-link relative px-4 py-2 text-sm rounded-lg hover:bg-amber-50/70 transition-colors duration-200"
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
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow-amber-200/80 hover:shadow-lg block"
                style={{ letterSpacing: "0.08em" }}
              >
                Book Now
              </Link>
            </motion.div>
          </nav>

          {/* ── Mobile Toggle ── */}
          <motion.button
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-amber-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
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
            <nav className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
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
                    className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 font-medium text-sm"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Book Now */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.07, duration: 0.3 }}
                className="mt-2"
              >
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex justify-center px-4 py-3.5 bg-amber-600 text-white rounded-xl font-bold text-xs tracking-widest uppercase transition-all hover:bg-amber-700 active:scale-95"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Book a Session
                </Link>
              </motion.div>
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
        <title>Deehar Productions</title>
        <meta name="description" content="Professional Photography and Videography Studio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        {/* Film grain overlay */}
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