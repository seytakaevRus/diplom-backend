import { verify, sign, Secret, SigningKeyCallback } from 'jsonwebtoken';
import { promisify } from 'util';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import {
  EMAIL_ALREADY_EXIST,
  NEED_AUTH,
  NEED_DATA,
  PASSWORDS_NOT_EQUAL,
  SERVER_ERROR,
  WRONG_CREDENTIALS,
} from '../constants/index';

import pull from '../db/db.config';

const verifyAsync = promisify(verify) as (
  token: string,
  secretOrPublicKey: Secret,
) => Promise<SigningKeyCallback>;

const authController = {
  async signIn(req: Request, res: Response) {
    const { password, email } = req.body;

    try {
      if (!password || !email) {
        throw new Error(NEED_DATA);
      }

      const [userData] = await pull.query(
        'SELECT id, email, firstname, lastname, password FROM diplom.users WHERE email = ?',
        [email],
      );

      // @ts-ignore
      if (userData.length === 0) {
        throw new Error(WRONG_CREDENTIALS);
      }

      const {
        password: passwordHash,
        id,
        firstname: firstName,
        lastname: lastName,
        // @ts-ignore
      } = userData[0];
      const fullName = `${firstName} ${lastName}`;

      if (!process.env.ACCESS_SECRET_KEY) {
        console.error('ACCESS_SECRET_KEY должен быть определен');
        throw new Error(SERVER_ERROR);
      }

      if (await bcrypt.compare(password, passwordHash)) {
        const token = sign(
          {
            email,
            id,
            fullName,
          },
          process.env.ACCESS_SECRET_KEY,
        );

        res.cookie('token', token, { httpOnly: true });

        res.status(200).send({
          id,
          fullName,
          email,
        });
      } else {
        throw new Error(WRONG_CREDENTIALS);
      }
    } catch (error: any) {
      if ('message' in error) {
        if (error.message === SERVER_ERROR) {
          res.status(500).send(error.message);
        } else {
          res.status(400).send(error.message);
        }
      }
    }
  },
  async signUp(req: Request, res: Response) {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    try {
      if (!firstName || !lastName || !email || !password || !passwordConfirm) {
        throw new Error(NEED_DATA);
      }

      const [emails] = await pull.query(
        'SELECT email FROM users WHERE email = ?',
        [email],
      );

      // @ts-ignore
      if (emails.length > 0) {
        throw new Error(EMAIL_ALREADY_EXIST);
      } else if (password !== passwordConfirm) {
        throw new Error(PASSWORDS_NOT_EQUAL);
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(password, salt);

      const [rows] = await pull.query('INSERT INTO users SET ?', {
        firstName,
        lastName,
        email,
        password: passwordHash,
      });
      const fullName = `${firstName} ${lastName}`;

      if (!process.env.ACCESS_SECRET_KEY) {
        console.error('ACCESS_SECRET_KEY должен быть определен');
        throw new Error(SERVER_ERROR);
      }

      const token = sign(
        {
          email,
          // @ts-ignore
          id: rows.insertId,
          fullName,
        },
        process.env.ACCESS_SECRET_KEY,
      );

      res.cookie('token', token, { httpOnly: true });

      res.status(201).send({
        // @ts-ignore
        id: rows.insertId,
        fullName,
        email,
      });
    } catch (error: any) {
      if ('message' in error) {
        if (error.message === SERVER_ERROR) {
          res.status(500).send(error.message);
        } else {
          res.status(400).send(error.message);
        }
      }
    }
  },
  async whoAmI(req: Request, res: Response) {
    const { token } = req.cookies;

    try {
      if (!token) {
        throw new Error(NEED_AUTH);
      }

      if (!process.env.ACCESS_SECRET_KEY) {
        console.error('ACCESS_SECRET_KEY должен быть определен');
        throw new Error(SERVER_ERROR);
      }

      // TODO: Получать из токена ID пользователя и по нему из базы доставать пользователя.
      const userData = await verifyAsync(token, process.env.ACCESS_SECRET_KEY);
      res.status(200).send(userData);
    } catch (error: any) {
      if ('message' in error) {
        if (error.message === SERVER_ERROR) {
          res.status(500).send(error.message);
        } else {
          res.status(400).send(error.message);
        }
      }
    }
  },
};

export default authController;
