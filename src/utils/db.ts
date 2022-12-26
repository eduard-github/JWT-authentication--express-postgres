import { Pool, QueryResult } from 'pg';

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "apidb",
  password: "123456",
  port: 5432,
}

const pool = new Pool(credentials);

export async function query(sql: string, params?: any[]): Promise<QueryResult> {
  try {
    const client = await pool.connect();
    const res = await client.query(sql, params);
    client.release();
    return res;
  } catch (error) {
    console.error('DATABASE ERROR', error);
    return Promise.reject(error)
  }
}
