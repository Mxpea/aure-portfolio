"use client";

import { useEffect, useRef, useCallback } from "react";

interface PaginationHandlerProps {
  animationDuration?: number;
  cooldownTime?: number;
  threshold?: number;
}

export default function PaginationHandler({
  animationDuration = 600,
  cooldownTime = 300,
  threshold = 5,
}: PaginationHandlerProps = {}) {
  const isPending = useRef(false);
  const cooldownUntil = useRef(0);

  const getSections = useCallback(() => {
    return Array.from(document.querySelectorAll("section[id]")) as HTMLElement[];
  }, []);

  const getCurrentIndex = useCallback(() => {
    const sections = getSections();
    const y = window.scrollY;
    let idx = 0;
    let min = Infinity;
    sections.forEach((s, i) => {
      const d = Math.abs(s.offsetTop - y);
      if (d < min) { min = d; idx = i; }
    });
    return idx;
  }, [getSections]);

  const scrollToSlide = useCallback((slideIndex: number) => {
    const sections = getSections();
    if (isPending.current || slideIndex < 0 || slideIndex >= sections.length) return;

    const target = sections[slideIndex].offsetTop;
    const from = window.scrollY;
    const diff = target - from;
    if (Math.abs(diff) < threshold) return;

    const duration = animationDuration;
    let startTime: number | null = null;

    isPending.current = true;

    sections[slideIndex].classList.remove("blur-snap-in");
    void sections[slideIndex].offsetWidth;
    sections[slideIndex].classList.add("blur-snap-in");
    setTimeout(() => sections[slideIndex]?.classList.remove("blur-snap-in"), 1600);

    function step(time: number) {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart: fast start, smooth stop
      const eased = 1 - Math.pow(1 - progress, 4);
      window.scrollTo(0, from + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, target);
        isPending.current = false;
        cooldownUntil.current = Date.now() + cooldownTime;
      }
    }

    requestAnimationFrame(step);
  }, [getSections]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();

      if (isPending.current) return;
      if (Date.now() < cooldownUntil.current) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      scrollToSlide(getCurrentIndex() + dir);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (isPending.current || Date.now() < cooldownUntil.current) {
        e.preventDefault();
        return;
      }

      if (["ArrowDown", "PageDown", "Space"].includes(e.code)) {
        e.preventDefault();
        scrollToSlide(getCurrentIndex() + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.code)) {
        e.preventDefault();
        scrollToSlide(getCurrentIndex() - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
    };
  }, [getCurrentIndex, getSections, scrollToSlide]);

  return null;
}
