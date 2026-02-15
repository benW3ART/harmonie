/**
 * Simple in-memory rate limiter
 * For production, consider using @upstash/ratelimit with Redis
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const cache = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of cache.entries()) {
      if (entry.resetAt < now) {
        cache.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = cache.get(key)

  if (!entry || entry.resetAt < now) {
    // First request or window expired
    cache.set(key, {
      count: 1,
      resetAt: now + windowMs,
    })
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    }
  }

  if (entry.count >= limit) {
    // Rate limited
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(entry.resetAt / 1000),
    }
  }

  // Increment counter
  entry.count++
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: Math.ceil(entry.resetAt / 1000),
  }
}

// Rate limit configs
export const RATE_LIMITS = {
  // Authenticated users: 20 requests per minute
  AUTHENTICATED: { limit: 20, windowMs: 60 * 1000 },
  // Unauthenticated: 5 requests per minute per IP
  UNAUTHENTICATED: { limit: 5, windowMs: 60 * 1000 },
}
