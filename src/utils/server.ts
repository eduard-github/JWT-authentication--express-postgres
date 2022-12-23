import bodyParser from 'body-parser'
import express from 'express'
import {Express} from 'express-serve-static-core'
import morgan from 'morgan'

import usersModule from '../api/users/users.module'

export async function createServer(): Promise<Express> {
  const server: Express = express()

  server.use(bodyParser.json())

  server.use(morgan(':method :url :status :response-time ms - :res[content-length]'))

  server.use('/users', usersModule)

  server.get('/', (_req, res) => {
    res.send('Hello world!')
  })

  return server
}
