import ratelimiter from '../config/upstash.js'

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimiter.limit('my-rate-limit')
    if (!success) {
      return res.status(429).json({ message: 'Too many requests' })
    }
    next()
  } catch (error) {
    console.error('Error in rate limiter:', error)
    next(error)
    res.status(500).json({ message: 'Error in rate limiter' })
  }
}
export default rateLimiter
