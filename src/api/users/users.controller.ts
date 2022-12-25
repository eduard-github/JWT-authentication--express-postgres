import express, { Request, Response } from 'express'
import { jsonResponse } from '../../utils/jsonResponse'
import UserService from './users.service'

const router = express.Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await UserService.getUsers()
    console.log("CONTROL RES:", users)
    jsonResponse(res, 200, users)
  } catch (error) {
    console.log("CONTROL ERROR FROM DB:", error)
    jsonResponse(res, 500, error)
  }
})

router.get('/:userId', async (req: Request, res: Response) => {
  const { userId }: { userId?: string } = req.params
  try {
    const user = await UserService.getUserById(userId)
    console.log("CONTROL RES:", user)
    if(!user) {
      jsonResponse(res, 404, {error: {type: 'not_found', message: 'Not Found'}})
      return
    }
    jsonResponse(res, 200, user)
  } catch (error) {
    console.log("CONTROL ERROR FROM DB:", error)
    jsonResponse(res, 500, error)
  }
})

export { router }
