import { sql } from '../config/db.js'

export async function transactionByUser(req, res) {
  try {
    const { user_id } = req.params
    if (isNaN(parseInt(user_id))) {
      return res.status(400).json('Invalid user id')
    }
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`
    return res.status(200).json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return res.status(500).json({ message: 'Error fetching transactions' })
  }
}

export async function createTransaction(req, res) {
  try {
    const { user_id, title, category, amount } = req.body
    if (!user_id || !title || !category || amount === undefined) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const transaction =
      await sql`INSERT INTO transactions (user_id, title, category, amount) VALUES (${user_id}, ${title}, ${category}, ${amount}) RETURNING *`
    console.log(transaction)
    return res.status(201).json(transaction[0])
  } catch (error) {
    console.error('Error creating transaction:', error)
    return res.status(500).json({ message: 'Error creating transaction' })
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params

    if (isNaN(parseInt(id))) {
      return res.status(400).json('Invalid transaction id')
    }

    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`
    if (result.length === 0) {
      return res.status(404).json('Transaction not found')
    }
    return res.status(200).json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return res.status(500).json({ message: 'Error deleting transaction' })
  }
}

export async function summary(req, res) {
  try {
    const { user_id } = req.params
    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${user_id}`
    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${user_id} AND amount > 0`
    const expenseResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${user_id} AND amount < 0`
    const summary = {
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense
    }
    return res.status(200).json(summary)
  } catch (error) {
    console.error('Error fetching summary:', error)
    return res.status(500).json({ message: 'Error fetching summary' })
  }
}
