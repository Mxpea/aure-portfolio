"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fetchRepos, type GitHubRepo } from "@/lib/github-client";
import { GITHUB_USERNAME } from "@/lib/config";
import AnimatedText from "./AnimatedText";

const languageColors: Record<string, string> = {
  TypeScript: "from-blue-500/30 to-cyan-500/30",
  JavaScript: "from-yellow-500/30 to-amber-500/30",
  Python: "from-green-500/30 to-emerald-500/30",
  Rust: "from-orange-500/30 to-red-500/30",
  Go: "from-cyan-500/30 to-blue-500/30",
  HTML: "from-orange-500/30 to-pink-500/30",
  CSS: "from-blue-500/30 to-purple-500/30",
  Java: "from-red-500/30 to-orange-500/30",
  "C++": "from-pink-500/30 to-purple-500/30",
  C: "from-gray-500/30 to-blue-500/30",
  Shell: "from-green-500/30 to-teal-500/30",
  Vue: "from-emerald-500/30 to-green-500/30",
};

function RepoCard({ repo }: { repo: GitHubRepo }) {
  const colorClass = repo.language
    ? languageColors[repo.language] || "from-gray-500/30 to-slate-500/30"
    : "from-gray-500/30 to-slate-500/30";

  const createdDate = new Date(repo.created_at).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
  });

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="repo-card block relative w-[320px] md:w-[380px] h-[200px] md:h-[220px] shrink-0 rounded-xl md:rounded-2xl overflow-hidden glass cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass}`} />
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative h-full flex flex-col justify-between p-4 md:p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-foreground/60">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
            </svg>
            <span className="text-xs text-foreground/50">{createdDate}</span>
          </div>
          {repo.language && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium glass">
              {repo.language}
            </span>
          )}
        </div>

        <div className="mt-auto">
          <h3 className="text-base md:text-lg font-semibold truncate">{repo.name}</h3>
          <p className="mt-1.5 text-xs md:text-sm text-muted-foreground/70 line-clamp-2">
            {repo.description || "暂无描述"}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-3">
          {repo.stargazers_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
              </svg>
              <span>{repo.stargazers_count}</span>
            </div>
          )}
          {repo.forks_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
              </svg>
              <span>{repo.forks_count}</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

function MarqueeRow({ repos, direction }: { repos: GitHubRepo[]; direction: "left" | "right" }) {
  const animClass = direction === "left" ? "marquee-card-left" : "marquee-card-right";
  // 3 sets: extra padding at start and end so seam is off-screen
  const tripled = [...repos, ...repos, ...repos];

  return (
    <div className="marquee-pause-container overflow-hidden py-3">
      <div className={`w-max flex ${animClass}`}>
        {tripled.map((repo, i) => (
          <div key={`${repo.id}-${i}`} className="pr-4 md:pr-6">
            <RepoCard repo={repo} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorksSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRepos()
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const mid = Math.ceil(repos.length / 2);
  const row1 = repos.slice(0, mid);
  const row2 = repos.slice(mid);

  return (
    <section className="relative min-h-screen flex flex-col justify-center py-20 md:py-28 overflow-hidden" id="works">
      <div className="text-center mb-12 md:mb-16 px-4">
        <motion.span
          className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Portfolio
        </motion.span>
        <motion.h2
          className="mt-3 md:mt-4 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <AnimatedText text="Open Source Works" delayPerChar={0.05} initialDelay={0.2} />
        </motion.h2>
        <motion.p
          className="mt-4 text-sm md:text-base text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          来自 GitHub 的开源项目
        </motion.p>
      </div>

      {loading ? (
        <div className="space-y-4 px-4">
          {[0, 1].map((row) => (
            <div key={row} className="flex gap-4 md:gap-6 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[320px] md:w-[380px] h-[200px] md:h-[220px] shrink-0 rounded-xl md:rounded-2xl glass animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">GitHub 数据加载失败</p>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline"
          >
            前往 GitHub 查看 →
          </a>
        </div>
      ) : repos.length > 0 ? (
        <div className="space-y-3">
          {row1.length > 0 && <MarqueeRow repos={row1} direction="left" />}
          {row2.length > 0 && <MarqueeRow repos={row2} direction="right" />}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">暂无项目数据</div>
      )}

      {repos.length > 0 && (
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass text-sm font-medium hover:bg-foreground/10 transition-colors"
          >
            <span>查看全部项目</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      )}
    </section>
  );
}
