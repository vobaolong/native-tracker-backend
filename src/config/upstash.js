import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { ENV } from './env.js'

const ratelimiter = new Ratelimit({
  redis: Redis.fromEnv(
    ENV.UPSTASH_REDIS_REST_URL,
    ENV.UPSTASH_REDIS_REST_TOKEN
  ),
  limiter: Ratelimit.slidingWindow(100, '60 s')
})

export default ratelimiter
