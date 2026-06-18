"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic imports for better performance
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), {
  ssr: false,
});
const Navigation = dynamic(() => import("@/components/Navigation"), {
  ssr: false,
});
const HeroSection = dynamic(() => import("@/components/HeroSection"), {
  ssr: false,
});
const WorksSection = dynamic(() => import("@/components/WorksSection"), {
  ssr: false,
});
const AboutSection = dynamic(() => import("@/components/AboutSection"), {
  ssr: false,
});
const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  ssr: false,
});
const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), {
  ssr: false,
});
const PaginationHandler = dynamic(() => import("@/components/PaginationHandler"), {
  ssr: false,
});
const FriendLinksSection = dynamic(() => import("@/components/FriendLinksSection"), {
  ssr: false,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <main className="relative min-h-screen bg-background">
      {/* Loading screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Custom cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navigation />

      {/* Smooth Pagination Handler */}
      <PaginationHandler />

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Main content */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            className="relative"
            initial={{ filter: "blur(20px)", opacity: 0, scale: 0.98 }}
            animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <HeroSection />
            <WorksSection />
            <AboutSection />
            <ContactSection />
            <FriendLinksSection />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
