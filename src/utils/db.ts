import { Pool, QueryResult } from 'pg'

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "apidb",
  password: "123456",
  port: 5432,
}

const pool = new Pool(credentials)

export async function query(sql: string, params?: any[]): Promise<QueryResult | undefined> {
  try {
    const client = await pool.connect()
    const res = await client.query(sql, params)
    client.release()
    return res
  } catch (err) {
    console.error(err)
  }
}
