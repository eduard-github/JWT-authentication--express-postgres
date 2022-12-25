import express, { Request, Response } from 'express'
import UserService from './users.service'

const router = express.Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await UserService.getUsers()
    console.log("CONTROL RES:", data)
    res.json(data)
  } catch (error) {
    console.log("CONTROL ERROR FROM DB:", error)
    res.end('Error')
  }
})

router.get('/:userId', async (req: Request, res: Response) => {
  const { userId }: { userId?: string } = req.params
  try {
    const data = await UserService.getUserById(userId)
    console.log("CONTROL RES:", data)
    res.json(data)
  } catch (error) {
    console.log("CONTROL ERROR FROM DB:", error)
    res.end('Error')
  }
})

export { router }
