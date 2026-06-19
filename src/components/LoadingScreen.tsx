"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";

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
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const loadedRef = useRef(false);

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

  // Track page load
  useEffect(() => {
    if (document.readyState === "complete") {
      loadedRef.current = true;
      return;
    }
    const handleLoad = () => { loadedRef.current = true; };
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  // Pseudo progress with randomness
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;

        // Random increment: small when not loaded, faster when loaded
        const rand = Math.random();
        let inc;
        if (loadedRef.current) {
          inc = 3 + rand * 8; // 3-11% per tick
        } else {
          inc = 0.5 + rand * 2; // 0.5-2.5% per tick
        }

        const next = Math.min(100, p + inc);
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // When progress hits 100, wait 1s then trigger exit
  useEffect(() => {
    if (progress >= 100 && !done) {
      const t = setTimeout(() => {
        setDone(true);
        setTimeout(onComplete, 800);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [progress, done, onComplete]);

  // Start text animation
  useEffect(() => {
    setPhase(1);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] overflow-hidden bg-black"
      animate={
        done
          ? { clipPath: "inset(0 0 0 100%)" }
          : { clipPath: "inset(0 0 0 0%)" }
      }
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Accent edge glow */}
      <motion.div
        className="absolute top-0 bottom-0 w-2 bg-accent z-50 pointer-events-none"
        initial={{ left: "0%", opacity: 0 }}
        animate={
          done
            ? { left: "100%", opacity: [0, 1, 1, 0] }
            : { left: "0%", opacity: 0 }
        }
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Subtle gradient */}
      <div
        className="absolute inset-0 opacity-8"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, var(--accent) 0%, transparent 70%)",
        }}
      />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 md:gap-8">
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
                  : undefined
              }
              transition={{
                duration: 1,
                delay: 0.3 + f.delay,
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
                  : undefined
              }
              transition={{
                duration: 1,
                delay: 0.8 + f.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {f.char}
            </motion.span>
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          className="w-48 md:w-64 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent/60 via-accent to-accent/60 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 text-center">
            <span className="text-[10px] font-mono text-white/30 tracking-[0.3em]">
              {Math.round(progress)}%
            </span>
          </div>
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
