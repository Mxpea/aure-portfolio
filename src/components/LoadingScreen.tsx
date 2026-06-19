"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

interface Fragment {
  char: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const word1 = "AURELITH";
  const word2 = "MXPEA";

  const fragments1 = useMemo<Fragment[]>(() => {
    return word1.split("").map((char, i) => ({
      char,
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 400,
      rotate: (Math.random() - 0.5) * 120,
      scale: 0.5 + Math.random() * 0.5,
      delay: i * 0.07,
    }));
  }, []);

  const fragments2 = useMemo<Fragment[]>(() => {
    return word2.split("").map((char, i) => ({
      char,
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 300,
      rotate: (Math.random() - 0.5) * 90,
      scale: 0.5 + Math.random() * 0.5,
      delay: 0.5 + i * 0.07,
    }));
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setPhase(3), 3000);
    const t4 = setTimeout(() => setIsVisible(false), 4000);
    const t5 = setTimeout(onComplete, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[10000] overflow-hidden bg-black"
      animate={
        phase >= 3
          ? { clipPath: "inset(0 0 0 100%)" }
          : { clipPath: "inset(0 0 0 0%)" }
      }
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Accent edge glow on the wipe line */}
      <motion.div
        className="absolute top-0 bottom-0 w-2 bg-accent z-50 pointer-events-none"
        initial={{ left: "0%", opacity: 0 }}
        animate={
          phase >= 3
            ? { left: "100%", opacity: [0, 1, 1, 0] }
            : { left: "0%", opacity: 0 }
        }
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Subtle gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 3 }}
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, var(--accent) 0%, transparent 70%)",
        }}
      />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 md:gap-6">
        {/* AURELITH */}
        <div className="flex items-center justify-center">
          {fragments1.map((f, i) => (
            <motion.span
              key={`1-${i}`}
              className="text-[3rem] md:text-[5rem] lg:text-[7rem] font-black text-white/90 tracking-tighter"
              initial={{
                x: f.x,
                y: f.y,
                rotate: f.rotate,
                scale: f.scale,
                opacity: 0,
                filter: "blur(8px)",
              }}
              animate={
                phase >= 1
                  ? {
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      opacity: 1,
                      filter: "blur(0px)",
                    }
                  : {}
              }
              transition={{
                duration: 1,
                delay: f.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {f.char}
            </motion.span>
          ))}
        </div>

        {/* MXPEA */}
        <div className="flex items-center justify-center">
          {fragments2.map((f, i) => (
            <motion.span
              key={`2-${i}`}
              className="text-sm md:text-lg lg:text-xl font-mono text-accent/60 tracking-[0.4em]"
              initial={{
                x: f.x,
                y: f.y,
                rotate: f.rotate,
                scale: f.scale,
                opacity: 0,
                filter: "blur(6px)",
              }}
              animate={
                phase >= 1
                  ? {
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      opacity: 1,
                      filter: "blur(0px)",
                    }
                  : {}
              }
              transition={{
                duration: 1,
                delay: f.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {f.char}
            </motion.span>
          ))}
        </div>

        {/* Latin text */}
        <motion.div
          className="mt-6 md:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] md:text-xs font-mono text-white/30 tracking-[0.2em] uppercase">
            ad perpetranda miracula rei unius
          </p>
        </motion.div>
      </div>

      {/* Noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
        }}
      />
    </motion.div>
  );
}
