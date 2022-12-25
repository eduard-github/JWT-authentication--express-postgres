import { query } from "../../utils/db";

async function getUsers() {
  const sql = 'SELECT * FROM users'
  try {
    const res = await query(sql);
    console.log('SERVICE ROW RES', res?.rows);
    return res?.rows
  } catch (error) {
    console.log('SERVICE ERROR FROM DB', error)  
    return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  }
}

async function getUserById(id: string) {
  const sql = 'SELECT * FROM users WHERE id = $1';
  const params = [id];
  try {
    const res = await query(sql, params);
    console.log('SERVICE RES', res?.rows[0]);
    return res?.rows[0]
  } catch (error) {
    console.log('SERVICE ERROR FROM DB', error)  
    return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  }
}

export default { getUserById, getUsers }
