import express from 'express'
import { ENV } from './config/env.js'
import { sql } from './config/db.js'
const app = express()
const PORT = ENV.PORT || 8001

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
			user_id VARCHAR(255) NOT NULL,
			title VARCHAR(255) NOT NULL,
			category VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  }
}
// if (ENV.NODE_ENV === 'production') job.start()

// app.use(cors())
app.use(express.json())

app.post('/api/transactions', async (req, res) => {
  try {
    const { user_id, title, category, amount } = req.body
    if (!user_id || !title || !category || !amount) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const transaction =
      await sql`INSERT INTO transactions (user_id, title, category, amount) VALUES (${user_id}, ${title}, ${category}, ${amount}) RETURNING *`
    console.log(transaction)
    res.status(201).json(transaction.rows[0])
  } catch (error) {
    console.error('Error creating transaction:', error)
    res.status(500).json({ message: 'Error creating transaction' })
  }
})

app.get('/api/transactions', async (req, res) => {
  const { user_id } = req.query
  if (!user_id) {
    return res.status(400).json({ message: 'Missing user_id' })
  }
  const transactions =
    await sql`SELECT * FROM transactions WHERE user_id = ${user_id}`
  res.status(200).json(transactions.rows)
})

initDB().then(() =>
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
)
