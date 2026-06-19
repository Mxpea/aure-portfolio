"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/Mxpea",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-6 md:h-6">
        <path
          d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21C9.5 20.77 9.5 20.14 9.5 19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26C14.5 19.6 14.5 20.68 14.5 21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 6.477 17.523 2 12 2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Bilibili",
    url: "https://b23.tv/PF7182s",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-6 md:h-6">
        <path
          d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Pixiv",
    url: "https://www.pixiv.net/users/78104130",
    icon: (
      <svg width="20" height="20" viewBox="-.125 -.125 1024.25 1024.25" xmlns="http://www.w3.org/2000/svg" className="md:w-6 md:h-6 fill-current">
        <path d="m210.56 0a210.09 210.09 0 0 0 -210.56 210.56v602.88a210.09 210.09 0 0 0 210.56 210.56h602.88a210.09 210.09 0 0 0 210.56-210.56v-602.88a210.09 210.09 0 0 0 -210.56-210.56zm333.227 194.006c93.056 0 173.14 28.842 230.357 78.805a261.034 261.034 0 0 1 90.282 198.826c.214 79.104-37.546 148.31-96.298 194.688-58.667 46.592-137.6 72.405-224.341 72.405-98.73 0-190.294-35.925-190.294-35.925v115.968c16.94 4.95 44.715 15.573 27.094 33.237h-133.547c-17.493-17.493 8.107-27.733 27.478-33.237v-491.69c-44.928 34.56-67.968 64.426-79.702 86.656 13.654 43.52-12.117 41.344-12.117 41.344l-46.507-73.814s165.035-187.306 407.595-187.306zm-8.107 41.429c-60.715-.128-135.85 20.181-182.187 53.077v368.896c42.155 20.779 105.984 35.499 181.76 35.499h.427c68.096 0 127.147-25.302 167.68-65.408 40.618-40.448 63.402-93.142 63.658-157.142-.213-65.706-21.504-122.197-60.586-164.693-39.168-42.325-97.024-70.186-170.752-70.23z" />
      </svg>
    ),
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [emailCopied, setEmailCopied] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const email = "a142311@outlook.com";

  const copyEmail = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else {
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-24 md:py-32 px-4 md:px-8"
      id="contact"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div
          className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full opacity-20 blur-[80px] md:blur-[120px]"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-xl md:max-w-2xl mx-auto">
        {/* Header */}
        <motion.span
          className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Contact
        </motion.span>
        <motion.h2
          className="mt-3 md:mt-4 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Let&apos;s Create
        </motion.h2>
        <motion.p
          className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          有想法？让我们一起创造令人惊叹的东西。
        </motion.p>

        {/* Email button - creative interactive */}
        <motion.div
          className="mt-8 md:mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={copyEmail}
            className="group relative px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl glass-strong overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-accent"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />

            {/* Content */}
            <div className="relative flex items-center gap-2 md:gap-3">
              <motion.div
                animate={emailCopied ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                {emailCopied ? (
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="md:w-5 md:h-5">
                    <path
                      d="M16.667 5L7.5 14.167L3.333 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="md:w-5 md:h-5">
                    <path
                      d="M3.333 5H16.667C17.583 5 18.333 5.75 18.333 6.667V13.333C18.333 14.25 17.583 15 16.667 15H3.333C2.417 15 1.667 14.25 1.667 13.333V6.667C1.667 5.75 2.417 5 3.333 5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.333 6.667L10 11.667L1.667 6.667"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </motion.div>
              <span className="text-sm md:text-base font-medium group-hover:text-accent-foreground transition-colors">
                {emailCopied ? "Copied!" : email}
              </span>
            </div>
          </motion.button>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="mt-8 md:mt-12 flex items-center justify-center gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative p-3 md:p-4 rounded-lg md:rounded-xl glass hover:bg-foreground/10 transition-colors"
              onHoverStart={() => setHoveredLink(link.name)}
              onHoverEnd={() => setHoveredLink(null)}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.icon}

              {/* Tooltip */}
              <motion.div
                className="absolute -bottom-7 md:-bottom-8 left-1/2 -translate-x-1/2 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium glass whitespace-nowrap"
                initial={{ opacity: 0, y: -5 }}
                animate={
                  hoveredLink === link.name
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -5 }
                }
                transition={{ duration: 0.2 }}
              >
                {link.name}
              </motion.div>
            </motion.a>
          ))}
        </motion.div>

        {/* Footer text */}
        <motion.div
          className="mt-16 md:mt-20 text-xs md:text-sm text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p>Designed & Built by Aurelith</p>
          <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
        </motion.div>
      </div>
    </section>
  );
}
