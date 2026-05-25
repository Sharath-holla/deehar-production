"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default 12)
  perspective?: number; // Perspective distance (default 1000)
}

export default function ThreeDCard({
  children,
  className = "",
  maxTilt = 12,
  perspective = 1000,
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse coords mapped to rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Buttery-smooth spring motion vectors
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 180,
    damping: 18,
  });

  //Specula sheen reflection overlay position
  const shineX = useSpring(useTransform(x, [-0.5, 0.5], ["-100%", "100%"]), {
    stiffness: 180,
    damping: 18,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize mouse position between -0.5 and 0.5
    const relativeX = (event.clientX - rect.left) / width - 0.5;
    const relativeY = (event.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Specular light shimmer reflection overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-[4] mix-blend-overlay"
          style={{
            left: shineX,
            skewX: -20,
          }}
        />
        
        {children}
      </motion.div>
    </motion.div>
  );
}
