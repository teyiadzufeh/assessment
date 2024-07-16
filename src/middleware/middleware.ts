import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';
import { FirebaseAuthService } from 'src/services/firebase-auth.service';
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

@Injectable()
export class authMiddleware implements NestMiddleware {
  constructor(private readonly firebaseAuthService: FirebaseAuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null; // Assume the token is in the Authorization header

    if (!token) {
      next(new HttpException('Authorization token not found',401))
      return;
    }

    try {
      const decodedToken = await this.firebaseAuthService.verifyIdToken(token);
      req['user'] = decodedToken; // Attach the decoded token to the request object
      next();
    } catch (error) {
        console.log(error)
        if (error.errorInfo.code == 'auth/id-token-expired') next(new HttpException('Token has expired. Login to get a fresh access token',401))
        next(new HttpException('Wrong authtentication token', 401));
    }
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