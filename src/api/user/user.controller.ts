import express, { Request, Response } from 'express'
import { jsonResponse } from '../../utils/jsonResponse'
import UserService from './user.service'

const router = express.Router()

router.post('/signin', async (req: Request, res: Response) => {
  const { email, password }: { email: string, password: string } = req.body
  try {
    const resp = await UserService.signIn(email, password)
    console.log("CONTROL RES:", resp)
    if (resp?.error) {
      if (resp.error.type === 'invalid_credentials') {
        jsonResponse(res, 404, resp)
      } else {
        throw new Error(`unsupported ${resp}`)
      }
    } else {
      const {userId, token} = resp as {token: string, userId: string}
      jsonResponse(res, 200, {userId: userId, token: token})
    }
  } catch (error) {
    console.log("CONTROL ERROR FROM DB:", error)
    jsonResponse(res, 500, error)
  }
})

router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password }: { name: string, email: string, password: string } = req.body
  try {
    const resp = await UserService.signUp(name, email, password)
    console.log("CONTROL RES:", resp)
    if(!res) {
      jsonResponse(res, 404, {error: {type: 'not_found', message: 'Not Found'}})
    } else {
      jsonResponse(res, 200, resp)
    }
  } catch (error) {
    console.log("CONTROL ERROR FROM DB:", error)
    jsonResponse(res, 500, error)
  }
})


// router.get('/:userId', async (req: Request, res: Response) => {
//   const { userId }: { userId?: string } = req.params
//   try {
//     const user = await UserService.getUserById(userId)
//     console.log("CONTROL RES:", user)
//     if(!user) {
//       jsonResponse(res, 404, {error: {type: 'not_found', message: 'Not Found'}})
//     } else {
//       jsonResponse(res, 200, user)
//     }
//   } catch (error) {
//     console.log("CONTROL ERROR FROM DB:", error)
//     jsonResponse(res, 500, error)
//   }
// })
//
// router.get('/', async (_req: Request, res: Response) => {
//   try {
//     const users = await UserService.getUsers()
//     console.log("CONTROL RES:", users)
//     jsonResponse(res, 200, users)
//   } catch (error) {
//     console.log("CONTROL ERROR FROM DB:", error)
//     jsonResponse(res, 500, error)
//   }
// })

export { router }
