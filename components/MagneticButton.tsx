"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number; // Strength of magnetism (default 0.35)
}

export default function MagneticButton({
  children,
  className = "",
  magneticStrength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Position offsets
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs
  const springX = useSpring(x, { stiffness: 220, damping: 15 });
  const springY = useSpring(y, { stiffness: 220, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate offset relative to button center
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;
    
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    // Apply strength pull
    x.set(distanceX * magneticStrength);
    y.set(distanceY * magneticStrength);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block ${className}`}
      style={{
        x: springX,
        y: springY,
      }}
    >
      <motion.div
        animate={{
          scale: hovered ? 1.03 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
