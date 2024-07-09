import { HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import admin from 'src/services/user.service';
import { RequestHandler } from 'express';
import { ZodTypeAny } from 'zod/lib/types';

const now = new Date();

const pad = (number: number) => (number < 10 ? '0' : '') + number;

const day= pad(now.getDate());
const month = pad(now.getMonth() + 1); // Months are zero-based
const year = now.getFullYear();

let hours = now.getHours();
const minutes = pad(now.getMinutes());
const seconds = pad(now.getSeconds());

const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12; // The hour '0' should be '12'
const strHours = pad(hours);

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.url} ${res.statusCode} - ${day}/${month}/${year}, ${strHours}:${minutes}:${seconds} ${ampm}`);
  next();
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const token = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

      if (!token) {
          next(new HttpException('Invalid token',401))
          return;
      }

      // // Decode the token and parse into json to read the values
      const decodeToken = admin.auth().verifyIdToken(token);
      if (decodeToken){
        console.log(decodeToken);
        next()
      } else {
        next(new HttpException('Invalid token',401))
        return;
      }
      // const userId: string = decodeToken.sub;

      // // reject token if userid is not present in the token
      // if (!userId) {
      //     next(new HttpException(401, 'Invalid token'));
      //     return;
      // }

      // // check for token expiration
      // const exp = decodeToken.exp;
      // if (exp) {
      //     const date = new Date(0);
      //     date.setUTCSeconds(decodeToken.exp);
      //     const offsetSeconds = 0;

      //     // check if the token is expired
      //     if (!(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000)) {
      //         logger.info('Token is expired');
      //         next(new HttpException(401, 'Token is expired'));
      //     }
      // }

      // // save user to app locals
      // req.user = decodeToken;

      next();

  } catch (error) {
      // next(new HttpException(401, 'Wrong authtentication token'));
  }
}
export const validationMiddleware = (schema: ZodTypeAny, value: string | 'body' | 'query' | 'params' = 'body')
    : RequestHandler => {
    return (req, res, next) => {
        const parsed = schema.safeParse(req[value]);

        if (!parsed.success) {
            next(new HttpException(parsed.error.message,400));
        } else {
            next();
        }
    }
}