import { neon } from '@neondatabase/serverless'
import { ENV } from './env.js'

export const sql = neon(ENV.DATABASE_URL)
