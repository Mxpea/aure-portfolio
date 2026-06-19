type CacheEntry = { data: unknown; expires: number };

const memCache = new Map<string, CacheEntry>();

function get(key: string): CacheEntry | null {
  const now = Date.now();
  const entry = memCache.get(key);
  if (entry && entry.expires > now) return entry;
  memCache.delete(key);
  return null;
}

function set(key: string, data: unknown, ttlMs: number) {
  // Limit cache size
  if (memCache.size > 200) {
    const oldest = memCache.keys().next().value;
    if (oldest) memCache.delete(oldest);
  }
  memCache.set(key, { data, expires: Date.now() + ttlMs });
}

export async function cachedFetch(url: string, ttlMs: number = 3600000): Promise<unknown> {
  const cached = get(url);
  if (cached) return cached.data;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (token) headers.Authorization = `bearer ${token}`;

  const res = await fetch(url, { headers });

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
