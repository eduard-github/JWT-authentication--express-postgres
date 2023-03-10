import bodyParser from 'body-parser'
import express from 'express'
import {Express} from 'express-serve-static-core'
import morgan from 'morgan'

import usersModule from '../api/user/user.module'
import { auth } from '../middleware/auth'

export async function createServer(): Promise<Express> {
  const server: Express = express()

  server.use(bodyParser.json())

  server.use(morgan(':method :url :status :response-time ms - :res[content-length]'))

  server.use('/user', usersModule)

  server.get('/', auth, (_req, res) => {
    res.send('Hello world!')
  })

  return server
}
