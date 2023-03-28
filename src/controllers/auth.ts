import bcrypt from 'bcrypt';
import { verify, sign } from 'jsonwebtoken';
import { Request, Response } from 'express';

import {
  EMAIL_ALREADY_EXIST,
  NEED_AUTH,
  NEED_DATA,
  PASSWORDS_NOT_EQUAL,
  SERVER_ERROR,
  WRONG_CREDENTIALS,
} from '../constants/index';
import sequelize from '../models/index';

const User = sequelize.models.User;

const authController = {
  async signIn(req: Request, res: Response) {
    const { password, email } = req.body;

    try {
      if (!password || !email) {
        throw new Error(NEED_DATA);
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error(WRONG_CREDENTIALS);
      }

      const {
        password: passwordHash,
        id,
        firstName,
        lastName,
      } = user.dataValues;

      if (!process.env.ACCESS_SECRET_KEY) {
        console.error('ACCESS_SECRET_KEY должен быть определен');
        throw new Error(SERVER_ERROR);
      }

      if (await bcrypt.compare(password, passwordHash)) {
        const token = sign(
          {
            id,
          },
          process.env.ACCESS_SECRET_KEY,
        );

        res.cookie('token', token, { httpOnly: true });

        const responseData = {
          id,
          fullName: `${firstName} ${lastName}`,
          email,
        };

        res.status(200).send(responseData);
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

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (user) {
        throw new Error(EMAIL_ALREADY_EXIST);
      } else if (password !== passwordConfirm) {
        throw new Error(PASSWORDS_NOT_EQUAL);
      }

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(password, salt);

      const { dataValues } = await User.create({
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
          id: dataValues.id,
        },
        process.env.ACCESS_SECRET_KEY,
      );

      res.cookie('token', token, { httpOnly: true });

      const responseData = {
        id: dataValues.id,
        fullName,
        email,
      };

      res.status(201).send(responseData);
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

      verify(
        token,
        process.env.ACCESS_SECRET_KEY,
        async (err: any, result: any) => {
          if (err) throw err;

          if (!result.id) {
            console.error('В токене должно быть поле id');
            throw new Error(SERVER_ERROR);
          }

          const user = await User.findOne({
            where: {
              id: result.id,
            },
          });

          if (!user) {
            throw new Error(NEED_AUTH);
          }

          const { id, email, firstName, lastName } = user.dataValues;

          const responseData = {
            id,
            fullName: `${firstName} ${lastName}`,
            email,
          };

          res.status(200).send(responseData);
        },
      );
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
