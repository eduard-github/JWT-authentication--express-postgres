import fs from 'fs'
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import config from '../../config';
import { query } from "../../utils/db";
import { User } from './dto/user.dto';

const privateKey = fs.readFileSync(config.privateKeyFile)

const privateSecret = {
  key: privateKey,
  passphrase: config.privateKeyPassphrase
}
const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '1h'
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

async function signUp(user: User) {
  const { name, email, password } = user
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

async function signIn(user: User) {
  const { email, password } = user
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
    return { userId: user.id, token: authToken }
  } catch (error) {
    console.log('SERVICE ERROR FROM DB', error)  
    return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  }
}

export default { signUp, signIn }
