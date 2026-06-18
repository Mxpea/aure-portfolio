"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect } from "react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgX = useSpring(mouseX, { damping: 40, stiffness: 40 });
  const bgY = useSpring(mouseY, { damping: 40, stiffness: 40 });
  const fgX = useSpring(mouseX, { damping: 30, stiffness: 80 });
  const fgY = useSpring(mouseY, { damping: 30, stiffness: 80 });

  const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 80 });
  const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 80 });

  const bgTranslateX = useTransform(bgX, (v) => v * 0.02);
  const bgTranslateY = useTransform(bgY, (v) => v * 0.02);
  const fgTranslateX = useTransform(fgX, (v) => v * 0.04);
  const fgTranslateY = useTransform(fgY, (v) => v * 0.04 - 10);

  // Decorative element transforms - all through spring values
  const decoBgX = useTransform(bgX, (v) => v * 0.06);
  const decoBgY = useTransform(bgY, (v) => v * 0.06);
  const decoBgXNeg = useTransform(bgX, (v) => v * -0.04);
  const decoBgYNeg = useTransform(bgY, (v) => v * -0.04);
  const decoLetterX = useTransform(fgX, (v) => v * 0.06);
  const decoRingX = useTransform(fgX, (v) => v * 0.03);
  const decoLineX = useTransform(fgX, (v) => v * 0.05);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - (rect.left + rect.width / 2);
      const cy = e.clientY - (rect.top + rect.height / 2);
      mouseX.set(cx);
      mouseY.set(cy);
      const maxTilt = 15;
      rotateX.set(Math.max(-maxTilt, Math.min(maxTilt, cy * 0.05)));
      rotateY.set(Math.max(-maxTilt, Math.min(maxTilt, cx * -0.05)));
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      rotateX.set(0);
      rotateY.set(0);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, rotateX, rotateY]);

  // Reset parallax when scrolled past hero
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.1) {
        mouseX.set(0);
        mouseY.set(0);
        rotateX.set(0);
        rotateY.set(0);
      }
    });
    return unsub;
  }, [scrollYProgress, mouseX, mouseY, rotateX, rotateY]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* ===== BACK LAYER ===== */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ x: bgTranslateX, y: bgTranslateY }}
      >
        {/* Marquee text */}
        <div className="absolute inset-0 overflow-hidden flex flex-col justify-center pointer-events-none select-none opacity-30 -translate-x-[5%] -translate-y-[5%] w-[110%] h-[110%] rotate-[-10deg]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`w-max flex whitespace-nowrap text-outline text-[60px] md:text-[100px] lg:text-[120px] font-black uppercase leading-[0.85] will-change-transform ${i % 2 === 0 ? 'marquee-left' : 'marquee-right'}`}
            >
              <span>{"AURELITH MXPEA ".repeat(8)}</span>
              <span>{"AURELITH MXPEA ".repeat(8)}</span>
            </div>
          ))}
        </div>

        {/* Diagonal color blocks - through bgX/bgY springs */}
        <motion.div
          className="absolute -inset-[15%] pointer-events-none will-change-transform"
          style={{
            clipPath: "polygon(0 0, 65% 0, 0 70%)",
            x: decoBgX,
            y: decoBgY,
          }}
        >
          <div className="w-full h-full bg-accent/[0.20]" />
        </motion.div>
        <motion.div
          className="absolute -inset-[15%] pointer-events-none will-change-transform"
          style={{
            clipPath: "polygon(100% 30%, 100% 100%, 35% 100%)",
            x: decoBgXNeg,
            y: decoBgYNeg,
          }}
        >
          <div className="w-full h-full bg-purple-500/[0.20]" />
        </motion.div>

        {/* Gradient blobs */}
        <motion.div
          className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full opacity-40 blur-[60px] md:blur-[80px] will-change-transform"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            left: "15%",
            top: "35%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full opacity-30 blur-[60px] md:blur-[80px] will-change-transform"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            right: "0%",
            bottom: "5%",
          }}
        />
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }} />
      </motion.div>

      {/* ===== BIG DECORATIVE LETTERS - absolute positioned ===== */}
      <motion.div
        className="absolute top-0 right-0 z-[1] pointer-events-none select-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ x: decoLetterX }}
      >
        <span className="text-[25vw] md:text-[20vw] font-black leading-none text-foreground/[0.03] tracking-tighter">
          A.
        </span>
      </motion.div>

      {/* Rotating ring decoration */}
      <motion.div
        className="absolute top-[15%] right-[10%] w-[200px] h-[200px] md:w-[350px] md:h-[350px] pointer-events-none z-[2] will-change-transform"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ x: decoRingX }}
      >
        <div className="w-full h-full rounded-full border border-foreground/[0.06]" />
        <div className="absolute inset-4 rounded-full border border-dashed border-accent/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent" />
      </motion.div>

      {/* Diagonal accent line */}
      <motion.div
        className="absolute top-[30%] left-[60%] w-[300px] md:w-[500px] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none z-[2] origin-left"
        style={{ rotate: -25, x: decoLineX }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      />

      {/* ===== FRONT LAYER ===== */}
      <motion.div
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-20 will-change-transform"
        style={{ x: fgTranslateX, y: fgTranslateY }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left - text */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            style={{ y: textY, opacity }}
          >
            {/* Issue number */}
            <motion.div
              className="flex items-center gap-3 justify-center lg:justify-start mb-6 md:mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-[10px] md:text-xs font-mono text-accent/70 tracking-[0.3em]">NO. 001</span>
              <span className="w-16 h-px bg-gradient-to-r from-accent/50 to-transparent" />
              <span className="text-[10px] md:text-xs font-mono text-muted-foreground/30 tracking-[0.3em]">2026</span>
            </motion.div>

            {/* Title - massive, bold, dramatic */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-black tracking-[-0.06em] leading-[0.82]">
                {/* AURE - huge with glow */}
                <span className="block relative">
                  {/* Light rays behind text */}
                  <span className="light-rays z-0" aria-hidden />
                  {/* Volumetric glow wrapper */}
                  <span className="vol-glow relative block" data-text="AURE">
                    <span className="relative z-10 text-[5rem] md:text-[8rem] lg:text-[11rem] xl:text-[14rem] font-black rainbow-flow">
                      AURE
                    </span>
                  </span>
                </span>

                {/* LITH - offset, different weight */}
                <span className="block text-[2.5rem] md:text-[4rem] lg:text-[5.5rem] xl:text-[7rem] text-foreground/20 tracking-[0.1em] -mt-2 md:-mt-4 lg:-mt-6">
                  LITH
                </span>
              </h1>

              {/* Vertical Mxpea */}
              <motion.div
                className="hidden lg:flex absolute -right-12 xl:-right-16 top-0 bottom-0 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <div className="flex flex-col items-center gap-3 [writing-mode:vertical-lr] rotate-180">
                  <span className="text-xs font-mono tracking-[0.5em] text-accent uppercase">Mxpea</span>
                  <span className="w-px h-20 bg-gradient-to-b from-accent/50 to-transparent" />
                </div>
              </motion.div>
            </motion.div>

            {/* Mobile subtitle */}
            <motion.div
              className="lg:hidden mt-3 text-sm text-accent tracking-[0.5em] uppercase font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                Mxpea
              </motion.span>
            </motion.div>

            {/* Divider */}
            <motion.div
              className="flex items-center gap-3 mt-8 md:mt-10 mx-auto lg:mx-0 max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-accent"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="flex-1 h-px bg-gradient-to-r from-foreground/40 via-foreground/10 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.9 }}
                style={{ transformOrigin: "left" }}
              />
              <span className="text-[10px] font-mono text-muted-foreground/30 tracking-widest">CREATIVE DEV</span>
            </motion.div>

            {/* Latin quote */}
            <motion.p
              className="mt-8 md:mt-10 text-[11px] md:text-xs font-mono text-muted-foreground/30 tracking-[0.2em] uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              ad perpetranda miracula rei unius
            </motion.p>

            {/* Intro */}
            <motion.p
              className="mt-4 md:mt-5 text-sm md:text-base text-muted-foreground/60 max-w-md mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              创意开发者 & 设计师 — 探索代码与美学的无限可能
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="mt-8 md:mt-10 flex flex-wrap gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <a
                href="#works"
                className="group px-6 py-3 rounded-lg bg-foreground text-background text-sm font-medium relative overflow-hidden"
              >
                <span className="relative z-10 group-hover:text-background/90 transition-colors">查看作品</span>
                <div className="absolute inset-0 bg-accent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              </a>
              <a
                href="https://github.com/Mxpea"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg glass text-sm font-medium hover:bg-foreground/10 transition-colors border border-foreground/10"
              >
                GitHub
              </a>
            </motion.div>

            {/* Decorative dots */}
            <motion.div
              className="hidden md:flex items-center gap-1.5 mt-12 lg:mt-14 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              {Array.from({ length: 5 }).map((_, row) => (
                <div key={row} className="flex flex-col gap-1.5">
                  {Array.from({ length: 3 }).map((_, col) => (
                    <div
                      key={col}
                      className={`w-1 h-1 rounded-full transition-colors ${
                        row === 2 && col === 1 ? "bg-accent" : "bg-foreground/10"
                      }`}
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - portrait */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end"
            style={{ y: portraitY }}
          >
            <motion.div
              className="relative"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
            >
              <motion.div
                className="absolute inset-0 bg-accent/25 blur-[100px] rounded-full scale-90"
                animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="relative w-[320px] h-[453px] md:w-[450px] md:h-[637px] lg:w-[550px] lg:h-[779px] xl:w-[620px] xl:h-[878px]"
                initial={{ opacity: 0, scale: 0.85, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4, type: "spring", stiffness: 80 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.5 } }}
              >
                <Image
                  src="/aure.png"
                  alt="Aurelith Portrait"
                  fill
                  className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                  priority
                  sizes="(max-width: 768px) 320px, (max-width: 1024px) 450px, 620px"
                />
              </motion.div>

              {/* Floating accent dots */}
              <motion.div
                className="absolute -top-6 -right-6 w-3 h-3 rounded-full bg-accent/40"
                animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-[30%] -left-8 w-2 h-2 rounded-full bg-accent/30"
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div
                className="absolute -bottom-6 left-[20%] w-4 h-4 rounded-full border border-accent/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom line accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-muted-foreground/30"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Scroll</span>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M10 4L10 16M10 16L16 10M10 16L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
