"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  /** 每个字符的动画延迟（秒） */
  delayPerChar?: number;
  /** 初始延迟（秒） */
  initialDelay?: number;
  /** 动画持续时间（秒） */
  duration?: number;
  /** 附加类名 */
  className?: string;
  /** 是否一次性动画 */
  once?: boolean;
}

export default function AnimatedText({
  text,
  delayPerChar = 0.03,
  initialDelay = 0,
  duration = 0.5,
  className = "",
  once = true,
}: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          {word.split("").map((char, charIndex) => {
            const globalIndex = text
              .split(" ")
              .slice(0, wordIndex)
              .join(" ").length + charIndex;
            
            return (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                className="inline-block"
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={
                  hasAnimated
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 20, filter: "blur(8px)" }
                }
                transition={{
                  duration,
                  delay: initialDelay + globalIndex * delayPerChar,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {char}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}