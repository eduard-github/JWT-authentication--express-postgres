import fs from 'fs'
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import config from '../../config';
import { query } from "../../utils/db";

const privateKey = fs.readFileSync(config.privateKeyFile)
const publicKey = fs.readFileSync(config.publicKeyFile)

const privateSecret = {
  key: privateKey,
  passphrase: config.privateKeyPassphrase
}
const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '1h'
}
const verifyOptions: VerifyOptions = {
  algorithms: ['RS256']
}

const createAuthToken = (userId: string): Promise<string>  => {
  return new Promise((resolve, reject) => {
    jwt.sign({ userId }, privateSecret, signOptions, (err: Error | null, token: string | undefined) => { 
      if (err === null && token !== undefined) {
        resolve(token)
      } else {
        reject(err)
      }
    });
  })
}

async function signUp(name: string, email: string, password: string) {
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if(result.rowCount > 0) {
      return {error: {type: 'accout_already_exists', message: 'Account already exists'}} 
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertResult = await query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword]);
    console.log('SERVICE RES', insertResult);
    return insertResult?.rows[0]
  } catch (error) {
    console.log('SERVICE ERROR FROM DB', error)  
    return Promise.reject({error: {type: 'internal_server_error', message: error}})
  }
}


async function signIn(email: string, password: string) {
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('SERVICE RES', result);
    if(result.rowCount === 0) {
      return {error: {type: 'user_not_found', message: 'User not found'}} 
    }
    const user = result?.rows[0]
    const valid = await bcrypt.compare(password, user.password);
    if(!valid) {
      return {error: {type: 'invalid_password', message: 'Invalid password'}} 
    }
    const authToken = await createAuthToken(user.id)
    return { token: authToken }
  } catch (error) {
    console.log('SERVICE ERROR FROM DB', error)  
    return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  }
}


// async function getUserById(id: string) {
//   const sql = 'SELECT * FROM users WHERE id = $1';
//   const params = [id];
//   try {
//     const res = await query(sql, params);
//     console.log('SERVICE RES', res?.rows[0]);
//     return res?.rows[0]
//   } catch (error) {
//     console.log('SERVICE ERROR FROM DB', error.message)  
//     return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
//   }
// }
//
// async function getUsers() {
//   const sql = 'SELECT * FROM users'
//   try {
//     const res = await query(sql);
//     console.log('SERVICE ROW RES', res?.rows);
//     return res?.rows
//   } catch (error) {
//     console.log('SERVICE ERROR FROM DB', error.message)  
//     return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
//   }
// }

export default { signUp, signIn }
