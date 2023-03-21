import { verify, sign, Secret, SigningKeyCallback } from 'jsonwebtoken';
import { promisify } from 'util';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';

import pull from '../db/db.config';

const randomBytesAsync = promisify(randomBytes);
const verifyAsync = promisify(verify) as (
  token: string,
  secretOrPublicKey: Secret
) => Promise<SigningKeyCallback>;

const authController = {
  async signIn(req: Request, res: Response) {
    const { password, email } = req.body;

    if (!password || !email) {
      res.status(400).send('Данные не указаны');
    }

    try {
      const [userData] = await pull.query(
        'SELECT id, email, firstname, lastname, password FROM diplom.users WHERE email = ?',
        [email]
      );

      if (userData.length === 0) {
        res.status(400).send('Неправильный логин или пароль');
      }

      const {
        password: passwordHash,
        id,
        firstname: firstName,
        lastname: lastName,
      } = userData[0];
      const fullName = `${firstName} ${lastName}`;

      if (!process.env.ACCESS_SECRET_KEY) {
        throw new Error('ACCESS_SECRET_KEY must be defined');
      }

      if (await argon2.verify(passwordHash, password)) {
        const token = sign(
          {
            email,
            id,
            fullName,
          },
          process.env.ACCESS_SECRET_KEY
        );

        res.cookie('token', token, { httpOnly: true });

        res.status(200).send({
          id,
          fullName,
          email,
        });
      } else {
        res.status(400).send('Неправильный логин или пароль');
      }
    } catch (error) {
      console.error(error);
    }
  },
  async signUp(req: Request, res: Response) {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      res.status(400).send('Данные не указаны');
    }

    try {
      const [emails] = await pull.query(
        'SELECT email FROM users WHERE email = ?',
        [email]
      );

      if (emails.length > 0) {
        res.status(400).send('Такая почта уже существует');
      } else if (password !== passwordConfirm) {
        res.status(400).send('Пароли не совпадают');
      }

      const salt = await randomBytesAsync(32);
      const passwordHash = await argon2.hash(password, { salt });

      const [rows] = await pull.query('INSERT INTO users SET ?', {
        firstName,
        lastName,
        email,
        password: passwordHash,
      });
      const fullName = `${firstName} ${lastName}`;

      if (!process.env.ACCESS_SECRET_KEY) {
        throw new Error('ACCESS_SECRET_KEY must be defined');
      }

      const token = sign(
        {
          email,
          id: rows.insertId,
          fullName,
        },
        process.env.ACCESS_SECRET_KEY
      );

      res.cookie('token', token, { httpOnly: true });

      res.status(201).send({
        id: rows.insertId,
        fullName,
        email,
      });
    } catch (error) {
      console.error(error);
    }
  },
  async whoAmI(req: Request, res: Response) {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).send('Требуется авторизация');
    }

    if (!process.env.ACCESS_SECRET_KEY) {
      throw new Error('ACCESS_SECRET_KEY must be defined');
    }

    try {
      const userData = await verifyAsync(token, process.env.ACCESS_SECRET_KEY);
      res.status(200).send(userData);
    } catch (error) {
      // TODO: посмотреть как обрабатывать ошибки в Express.
      console.error(error);
    }
  },
};

export default authController;
