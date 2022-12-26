import fs from 'fs'
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import config from '../../config';

import { query } from "../../utils/db";

const privateKey = fs.readFileSync(config.privateKeyFile)
const privateSecret = {
  key: privateKey,
  passphrase: config.privateKeyPassphrase
}
const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '1h'
}

const publicKey = fs.readFileSync(config.publicKeyFile)
const verifyOptions: VerifyOptions = {
  algorithms: ['RS256']
}

const createAuthTocken = (userId: string): Promise<{token: string}>  => {
  return new Promise((resolve, reject) => {
    jwt.sign({ userId }, privateSecret, signOptions, (err: Error | null, token: string | undefined) => { 
      if (err === null && token !== undefined) {
        resolve({ token })
      } else {
        reject(err)
      }
    });
  })
}

async function signIn(email: string, password: string) {
  const sql = 'SELECT * FROM users WHERE email = $1';
  const params = [email];
  try {
    const res = await query(sql, params);
    const user = res?.rows[0]
    console.log('SERVICE RES', user);

    if(!user) {
      return {error: {type: 'invalid_credentials', message: 'Invalid Login/Password'}} 
    }

    const passwordMatch = user.password === password
    if(!passwordMatch) {
      return {error: {type: 'invalid_credentials', message: 'Invalid Login/Password'}} 
    }

    const authTocken = await createAuthTocken(user.id)
    return {userId: user.id, token: authTocken.token}
  } catch (error) {
    console.log('SERVICE ERROR FROM DB', error.message)  
    return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  }
}

async function signUp(name: string, email: string, password: string) {
  const sql = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
  const params = [name, email, password];
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
