import express, { Request, Response } from 'express'
import { jsonResponse } from '../../utils/jsonResponse'
import UserService from './user.service'

const router = express.Router()

router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  try {
    const result = await UserService.signUp(name, email, password)
    console.log("CONTROL RES:", result)
    if (result?.error) {
      if (result.error.type === 'accout_already_exists') {
        jsonResponse(res, 409, result)
      } else {
        throw new Error(`unsupported ${result}`)
      }
    } else {
      jsonResponse(res, 201, result)
    }
  } catch (error) {
    console.log("CONTROL ERROR FROM DB:", error)
    jsonResponse(res, 500, error)
  }
})

router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await UserService.signIn(email, password)
    console.log("CONTROL RES:", result)
    if (result?.error) {
      if (result.error.type === 'user_not_found') {
        jsonResponse(res, 404, result)
      } 
      if (result.error.type === 'invalid_password') {
        jsonResponse(res, 401, result)
      } 
    } else {
      const {token} = result as {token: string}
      jsonResponse(res, 200, {token})
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
