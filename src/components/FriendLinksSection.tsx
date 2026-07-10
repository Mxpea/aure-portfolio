"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

interface FriendLink {
  name: string;
  url: string;
  description: string;
}

function parseCSV(text: string): FriendLink[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  return lines.slice(1).map((line) => {
    const parts = line.split(",").map((s) => s.trim());
    return { name: parts[0] || "", url: parts[1] || "", description: parts[2] || "" };
  }).filter((l) => l.name && l.url);
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://favicon.im/${domain}`;
  } catch {
    return "";
  }
}

export default function FriendLinksSection() {
  const [links, setLinks] = useState<FriendLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/links.csv")
      .then((res) => res.text())
      .then((text) => {
        setLinks(parseCSV(text));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center py-24 md:py-32 px-4 md:px-8" id="links">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="relative z-10 text-center mb-16 md:mb-20">
        <motion.span
          className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Links
        </motion.span>
        <motion.h2
          className="mt-3 md:mt-4 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <AnimatedText text="友情链接" delayPerChar={0.05} initialDelay={0.2} />
        </motion.h2>
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl glass animate-pulse" />
            ))}
          </div>
        ) : links.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {links.map((link, index) => (
              <motion.a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 md:p-5 rounded-xl glass hover:bg-foreground/5 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={getFaviconUrl(link.url)}
                    alt={link.name}
                    width={32}
                    height={32}
                    className="w-6 h-6 md:w-8 md:h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm md:text-base font-semibold truncate group-hover:text-accent transition-colors">
                    {link.name}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground truncate">
                    {link.description}
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-1 transition-all"
                >
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">暂无友情链接</div>
        )}
      </div>

      <motion.div
        className="relative z-10 mt-16 text-center text-xs text-muted-foreground/40"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <p>友情链接数据每日自动更新</p>
      </motion.div>
    </section>
  );
}
