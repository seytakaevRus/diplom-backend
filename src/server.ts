import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRouter from './routes/auth';
import sequelize from './configs/connection';

const app = express();

dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_ORIGIN_URL,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRouter);

(async () => {
  try {
    await sequelize.sync();
    console.log('Successful synchronization with sequelize models.');

    app.listen(process.env.PORT, () => {
      console.log(`Server started on Port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
