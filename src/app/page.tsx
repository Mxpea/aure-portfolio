"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

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
      <div className="relative">
        {/* Hero section */}
        <HeroSection />

        {/* Works section */}
        <WorksSection />

        {/* About section */}
        <AboutSection />

        {/* Contact section */}
        <ContactSection />
      </div>
    </main>
  );
}
