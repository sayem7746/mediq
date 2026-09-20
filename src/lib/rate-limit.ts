const buckets = new Map<string, number[]>();

export function resetRateLimit() {
  buckets.clear();
}

export function checkRateLimit(
  key: string,
  options: { limit?: number; windowMs?: number; now?: number } = {},
): { ok: boolean; remaining: number } {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 15 * 60 * 1000;
  const now = options.now ?? Date.now();
  const stamps = (buckets.get(key) ?? []).filter(
    (stamp) => now - stamp < windowMs,
  );
  if (stamps.length >= limit) {
    buckets.set(key, stamps);
    return { ok: false, remaining: 0 };
  }
  stamps.push(now);
  buckets.set(key, stamps);
  return { ok: true, remaining: limit - stamps.length };
}
