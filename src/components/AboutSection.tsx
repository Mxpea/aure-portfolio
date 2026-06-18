"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { fetchGitHubContributions, fetchGitHubUser, fetchTopLanguages, type ContributionDay, type GitHubUser } from "@/lib/github";

function ContributionGraph({ contributions }: { contributions: ContributionDay[] }) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  
  // Group by week (7 days)
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count <= 2) return "bg-accent/30";
    if (count <= 4) return "bg-accent/50";
    if (count <= 6) return "bg-accent/70";
    return "bg-accent";
  };

  const weekCount = Math.min(weeks.length, 52);
  const displayWeeks = weeks.slice(-weekCount);

  return (
    <div className="relative">
      <div
        className="grid gap-[2px] md:gap-[3px] pb-4"
        style={{
          gridTemplateRows: "repeat(7, 1fr)",
          gridAutoFlow: "column",
          gridAutoColumns: "1fr",
        }}
      >
        {displayWeeks.map((week) =>
          week.map((day, dayIndex) => (
            <motion.div
              key={day.date}
              className={`aspect-square rounded-sm ${getColor(day.count)} cursor-pointer`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: dayIndex * 0.005 }}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              whileHover={{ scale: 1.5 }}
            />
          ))
        )}
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <motion.div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg glass text-xs whitespace-nowrap z-10"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="font-medium">{hoveredDay.count} 次贡献</span>
          <span className="text-muted-foreground ml-2">{hoveredDay.date}</span>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
        <span>少</span>
        {[0, 2, 4, 6, 8].map((count) => (
          <div key={count} className={`w-2.5 h-2.5 rounded-sm ${getColor(count)}`} />
        ))}
        <span>多</span>
      </div>
    </div>
  );
}

function GitHubStatsCard({ user }: { user: GitHubUser | null }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-30px" });

  const stats = [
    { label: "Repos", value: user?.public_repos ?? "-" },
    { label: "Followers", value: user?.followers ?? "-" },
    { label: "Following", value: user?.following ?? "-" },
  ];

  return (
    <motion.div
      ref={cardRef}
      className="glass-strong rounded-xl md:rounded-2xl p-5 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="md:w-5 md:h-5 text-accent">
            <path d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21C9.5 20.77 9.5 20.14 9.5 19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26C14.5 19.6 14.5 20.68 14.5 21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 6.477 17.523 2 12 2Z" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{user?.login || "Mxpea"}</div>
          <a
            href={user?.html_url || "https://github.com/Mxpea"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline"
          >
            View Profile
          </a>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-lg md:text-xl font-bold text-accent">{stat.value}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [topLangs, setTopLangs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchGitHubContributions("Mxpea"),
      fetchGitHubUser("Mxpea"),
      fetchTopLanguages("Mxpea"),
    ]).then(([contribs, userData, langs]) => {
      setContributions(contribs);
      setUser(userData);
      setTopLangs(langs);
      setLoading(false);
    });
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col py-24 md:py-32 px-4 md:px-8" id="about">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      {/* Section header */}
      <div className="relative z-10 text-center mb-16 md:mb-20">
        <motion.span
          className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          About
        </motion.span>
        <motion.h2
          className="mt-3 md:mt-4 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          GitHub Activity
        </motion.h2>
      </div>

      {/* Content - scrollable if exceeds viewport */}
      <div data-scroll-inner className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 overflow-y-auto flex-1 max-h-[calc(100vh-200px)]">
        {/* Intro text */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
            这是我的 GitHub 活动概览，展示了我在开源社区的参与情况和贡献历程。通过这些数据，你可以更好地了解我的技术兴趣、活跃度以及与其他开发者的互动。
            
            
          </p>
        </motion.div>

        {/* GitHub contribution graph */}
        <motion.div
          className="glass-strong rounded-xl md:rounded-2xl p-5 md:p-8 mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-sm md:text-base font-semibold">Contribution Activity</h3>
            <span className="text-xs text-muted-foreground">最近 20 周</span>
          </div>
          {loading ? (
            <div className="h-16 bg-muted/20 rounded animate-pulse" />
          ) : contributions.length > 0 ? (
            <ContributionGraph contributions={contributions} />
          ) : (
            <div className="text-sm text-muted-foreground">暂无数据</div>
          )}
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <GitHubStatsCard user={user} />
          
          {/* Activity summary */}
          <motion.div
            className="glass-strong rounded-xl md:rounded-2xl p-5 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm md:text-base font-semibold mb-4">Activity Summary</h3>
            <div className="space-y-3">
              {[
                { 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ), 
                  label: "主要语言", 
                  value: topLangs.length > 0 ? topLangs.join(", ") : "加载中..." 
                },
                { 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    </svg>
                  ), 
                  label: "专注领域", 
                  value: "Frontend, Design Systems" 
                },
                { 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
                      <path d="M14.7 6.3C14.7 6.3 16.5 4.5 18 6C19.5 7.5 17.7 9.3 17.7 9.3L16 11L18 13C19.1 14.1 19.1 15.9 18 17C16.9 18.1 15.1 18.1 14 17L12 15L10.3 16.7C10.3 16.7 8.5 18.5 7 17C5.5 15.5 7.3 13.7 7.3 13.7L9 12L7 10C5.9 8.9 5.9 7.1 7 6C8.1 4.9 9.9 4.9 11 6L13 8L14.7 6.3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 17L2 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ), 
                  label: "常用工具", 
                  value: "React, Next.js, Tailwind" 
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
