"use client";

import { useEffect, useRef, useCallback } from "react";
import { animate } from "framer-motion";

export default function PaginationHandler() {
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const accumulated = useRef(0);
  const resetTimer = useRef<NodeJS.Timeout | null>(null);
  const cooldownUntil = useRef(0);

  const getSections = useCallback(() => {
    return Array.from(document.querySelectorAll("section[id]")) as HTMLElement[];
  }, []);

  const getCurrentIndex = useCallback(() => {
    const sections = getSections();
    const y = window.scrollY;
    let idx = 0;
    let minDist = Infinity;
    sections.forEach((s, i) => {
      const dist = Math.abs(s.offsetTop - y);
      if (dist < minDist) { minDist = dist; idx = i; }
    });
    return idx;
  }, [getSections]);

  const snapRef = useRef<NodeJS.Timeout | null>(null);

  const snapTo = useCallback((target: number) => {
    if (animRef.current) animRef.current.stop();
    if (snapRef.current) clearTimeout(snapRef.current);
    accumulated.current = 0;
    cooldownUntil.current = Date.now() + 900;

    // Find target section and apply blur animation
    const sections = Array.from(document.querySelectorAll("section[id]")) as HTMLElement[];
    let targetSection: HTMLElement | null = null;
    for (const s of sections) {
      if (Math.abs(s.offsetTop - target) < 2) { targetSection = s; break; }
    }
    if (targetSection) {
      targetSection.classList.remove("blur-snap-in");
      void targetSection.offsetWidth; // force reflow
      targetSection.classList.add("blur-snap-in");
      setTimeout(() => targetSection?.classList.remove("blur-snap-in"), 1600);
    }

    animRef.current = animate(window.scrollY, target, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => window.scrollTo(0, v),
    });

    snapRef.current = setTimeout(() => {
      const sections = Array.from(document.querySelectorAll("section[id]")) as HTMLElement[];
      const y = window.scrollY;
      let closest = sections[0];
      let minDist = Infinity;
      sections.forEach((s) => {
        const dist = Math.abs(s.offsetTop - y);
        if (dist < minDist) { minDist = dist; closest = s; }
      });
      if (minDist > 2) {
        window.scrollTo({ top: closest.offsetTop, behavior: "smooth" });
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const THRESHOLD = 80;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      if (Date.now() < cooldownUntil.current) {
        e.preventDefault();
        accumulated.current = 0;
        return;
      }

      // Check if current section has scrollable internal content
      const sections = getSections();
      const idx = getCurrentIndex();
      const sec = sections[idx];
      if (sec) {
        const scrollable = sec.querySelector("[data-scroll-inner]") as HTMLElement | null;
        if (scrollable) {
          const atTop = scrollable.scrollTop <= 0;
          const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 2;
          const goingDown = e.deltaY > 0;
          const goingUp = e.deltaY < 0;

          // Allow internal scroll if not at boundary
          if ((goingDown && !atBottom) || (goingUp && !atTop)) {
            return; // don't preventDefault, let native scroll work
          }
        }
      }

      e.preventDefault();

      accumulated.current += e.deltaY;

      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => { accumulated.current = 0; }, 200);

      if (Math.abs(accumulated.current) >= THRESHOLD) {
        const dir = accumulated.current > 0 ? 1 : -1;
        const sections = getSections();
        const idx = getCurrentIndex();
        const next = Math.max(0, Math.min(idx + dir, sections.length - 1));
        snapTo(sections[next].offsetTop);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (Date.now() < cooldownUntil.current) {
        e.preventDefault();
        return;
      }

      if (["ArrowDown", "PageDown", "Space"].includes(e.code)) {
        e.preventDefault();
        const s = getSections();
        const i = getCurrentIndex();
        snapTo(s[Math.min(i + 1, s.length - 1)].offsetTop);
      } else if (["ArrowUp", "PageUp"].includes(e.code)) {
        e.preventDefault();
        const s = getSections();
        const i = getCurrentIndex();
        snapTo(s[Math.max(i - 1, 0)].offsetTop);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (snapRef.current) clearTimeout(snapRef.current);
    };
  }, [getCurrentIndex, getSections, snapTo]);

  return null;
}
