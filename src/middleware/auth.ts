import { NextFunction, Request, Response } from 'express';
import fs from 'fs'
import jwt, { JwtPayload, VerifyErrors, VerifyOptions } from 'jsonwebtoken';
import config from '../config';
import { jsonResponse } from '../utils/jsonResponse';

const publicKey = fs.readFileSync(config.publicKeyFile)

const verifyOptions: VerifyOptions = {
  algorithms: ['RS256']
}

export const SECRET_KEY = 'your-secret-key-here';

export interface CustomRequest extends Request {
  userId: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return jsonResponse(res, 401, {error: {type: 'no token provided', message: 'No token provided'}})
  }

  try {
    const decoded = jwt.verify(token, publicKey, verifyOptions);
    (req as CustomRequest).userId = decoded;

    next();
  } catch (err) {
    res.status(401).send({error: {type: 'invalid_token', message: 'Invalid token'}})
  }
};


// return new Promise((resolve, reject) => {
//   jwt.verify(token, publicKey, verifyOptions, (err: VerifyErrors | null, decoded: object | undefined) => { 
//     if (err === null && decoded !== undefined && (decoded as any).userId !== undefined) {
//       resolve(decoded)
//     } else {
//       reject({error: {type: 'invalid_token', message: 'Invalid token'}})
//     }
//   });
// })
