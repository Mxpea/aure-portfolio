"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 500);
    const timer2 = setTimeout(() => setPhase(2), 1500);
    const timer3 = setTimeout(() => setPhase(3), 2500);
    const timer4 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-accent/30"
                initial={{
                  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
                  scale: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-8">
            {/* Phase 0: Initial symbol */}
            <motion.div
              className="text-6xl font-bold text-foreground"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: phase >= 0 ? 1 : 0,
                scale: phase >= 0 ? 1 : 0.5,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.span
                className="inline-block"
                animate={{
                  rotateY: phase >= 1 ? 360 : 0,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                A
              </motion.span>
            </motion.div>

            {/* Phase 1: Expanding ring */}
            <motion.div
              className="absolute w-32 h-32 rounded-full border-2 border-accent/50"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: phase >= 1 ? [0, 1.5, 1] : 0,
                opacity: phase >= 1 ? [0, 0.5, 0.2] : 0,
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Phase 2: Text reveal */}
            <motion.div
              className="absolute top-24 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: phase >= 2 ? 1 : 0,
                y: phase >= 2 ? 0 : 20,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="text-sm tracking-[0.3em] text-muted-foreground uppercase">
                Loading Experience
              </div>
              <motion.div
                className="mt-4 h-0.5 bg-accent"
                initial={{ width: 0 }}
                animate={{ width: phase >= 2 ? 200 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Phase 3: Final flourish */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 3 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-px h-32 bg-gradient-to-b from-transparent via-accent to-transparent"
                  style={{
                    left: `${25 + i * 16.67}%`,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{
                    scaleY: phase >= 3 ? [0, 1, 0] : 0,
                    opacity: phase >= 3 ? [0, 0.5, 0] : 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Bottom progress bar */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-px bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${(phase / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            <div className="mt-4 text-xs text-muted-foreground text-center tracking-widest">
              {phase < 3 ? "INITIALIZING" : "READY"}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
