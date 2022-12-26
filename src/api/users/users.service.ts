// import fs from 'fs'
// import { SignOptions, VerifyOptions } from 'jsonwebtoken';
// import config from '../../config';

import { query } from "../../utils/db";

// const privateKey = fs.readFileSync(config.privateKeyFile)
// const privateSecret = {
//   key: privateKey,
//   passphrase: config.privateKeyPassphrase
// }
// const signOptions: SignOptions = {
//   algorithm: 'RS256',
//   expiresIn: '4d'
// }
//
// const publicKey = fs.readFileSync(config.publicKeyFile)
// const verifyOptions: VerifyOptions = {
//   algorithms: ['RS256']
// }


async function createUser(email: string, password: string) {
  const sql = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
  const params = [email, password];
  try {
    const res = await query(sql, params);
    console.log('SERVICE RES', res?.rows[0]);
    return res?.rows[0]
  } catch (error) {
    console.log('SERVICE ERROR FROM DB', error.message)  
    if(error.code === "23505") {
      return Promise.reject({error: {type: 'account_already_exists', message: email }})
    }
    return Promise.reject({error: {type: 'internal_server_error', message: error}})
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
    console.log('SERVICE ERROR FROM DB', error.message)  
    return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  }
}

async function getUsers() {
  const sql = 'SELECT * FROM users'
  try {
    const res = await query(sql);
    console.log('SERVICE ROW RES', res?.rows);
    return res?.rows
  } catch (error) {
    console.log('SERVICE ERROR FROM DB', error.message)  
    return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  }
}

export default { createUser, getUserById, getUsers }
