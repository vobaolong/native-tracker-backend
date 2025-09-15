import express from 'express'
import { ENV } from './config/env.js'
import { sql, initDB } from './config/db.js'
import rateLimiter from './middleware/rateLimiter.js'
import transactionRoute from './routes/transactionRoute.js'
import job from './config/cron.js'

const app = express()
const PORT = ENV.PORT || 8001
if (process.env.NODE_ENV === 'production') job.start()

// app.use(cors())
app.use(rateLimiter)
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})
app.use('/api/transactions', transactionRoute)

initDB().then(() =>
  app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`)
  })
)
