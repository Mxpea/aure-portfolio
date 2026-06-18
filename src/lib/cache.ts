import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const CACHE_DIR = join(process.cwd(), ".cache");
const CACHE_FILE = join(CACHE_DIR, "github.json");

type CacheEntry = { data: unknown; expires: number };
type CacheStore = Record<string, CacheEntry>;

function ensureCacheDir() {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function loadStore(): CacheStore {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveStore(store: CacheStore) {
  try {
    ensureCacheDir();
    writeFileSync(CACHE_FILE, JSON.stringify(store));
  } catch {
    // ignore write errors
  }
}

const memCache = new Map<string, CacheEntry>();

function get(key: string): CacheEntry | null {
  const now = Date.now();
  // Check memory first
  const mem = memCache.get(key);
  if (mem && mem.expires > now) return mem;
  // Check file
  const store = loadStore();
  const entry = store[key];
  if (entry && entry.expires > now) {
    memCache.set(key, entry);
    return entry;
  }
  return null;
}

function set(key: string, data: unknown, ttlMs: number) {
  const entry = { data, expires: Date.now() + ttlMs };
  memCache.set(key, entry);
  const store = loadStore();
  store[key] = entry;
  saveStore(store);
}

export async function cachedFetch(url: string, ttlMs: number = 3600000): Promise<unknown> {
  const cached = get(url);
  if (cached) return cached.data;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (token) headers.Authorization = `bearer ${token}`;

  const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });

  if (!res.ok) {
    const stale = get(url);
    if (stale) return stale.data;
    throw new Error(`Fetch failed: ${res.status}`);
  }

  const data = await res.json();
  set(url, data, ttlMs);
  return data;
}

export async function cachedPost(url: string, body: unknown, ttlMs: number = 3600000): Promise<unknown> {
  const key = url + JSON.stringify(body);
  const cached = get(key);
  if (cached) return cached.data;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (token) headers.Authorization = `bearer ${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const stale = get(key);
    if (stale) return stale.data;
    throw new Error(`Fetch failed: ${res.status}`);
  }

  const data = await res.json();
  set(key, data, ttlMs);
  return data;
}
