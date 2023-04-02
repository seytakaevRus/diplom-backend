import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { NEED_AUTH, SERVER_ERROR } from '../constants/index';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      throw new Error(NEED_AUTH);
    }

    if (!process.env.ACCESS_SECRET_KEY) {
      console.error('ACCESS_SECRET_KEY должен быть определен');
      throw new Error(SERVER_ERROR);
    }

    // @ts-ignore
    req.userId = verify(token, process.env.ACCESS_SECRET_KEY, (err: any, result: any) => {
      if (err) throw err;

      return result.id;
    });
    return next();
  } catch (error: any) {
    if ('message' in error) {
      if (error.message === SERVER_ERROR) {
        res.status(500).send(error.message);
      } else {
        res.status(400).send(error.message);
      }
    }
  }
};
