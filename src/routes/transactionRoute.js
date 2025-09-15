import express from 'express'
const router = express.Router()
import {
  createTransaction,
  transactionByUser,
  summary,
  deleteTransaction
} from '../controllers/transactionByUser.controller.js'
// POST ROUTE
router.post('/', createTransaction)
// GET ALL ROUTE
router.get('/:user_id', transactionByUser)
// DELETE ROUTE
router.delete(':id', deleteTransaction)
// SUMMARY ROUTE
router.get('/summary/:user_id', summary)

export default router
