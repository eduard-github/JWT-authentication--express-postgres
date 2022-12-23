import express, { NextFunction, Request, Response } from 'express'
import { query } from '../../utils/db'
const router = express.Router()

router.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log('Time: ', Date.now())
  next()
})

router.get('/', async (_req: Request, res: Response) => {
  const result = await query('SELECT * FROM users')
  console.log('RESULT: ', result)
  res.send('Users home page')
})

router.get('/:userId', (_req: Request, res: Response) => {
  res.send('User home page')
})

export { router }
