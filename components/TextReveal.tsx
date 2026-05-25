"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  wordDelay?: number;
}

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  wordDelay = 0.05,
}: TextRevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: wordDelay,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      filter: "blur(8px)",
      scale: 0.94,
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1], // cinematic cubic-bezier
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={`inline-block overflow-hidden pb-1 ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em] overflow-hidden">
          <motion.span
            variants={wordVariants}
            className="inline-block origin-bottom"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
