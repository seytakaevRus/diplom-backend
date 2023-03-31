import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRouter from './routes/auth';
import coursesRouter from './routes/courses';

const app = express();

dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_ORIGIN_URL,
  }),
);

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/courses', coursesRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server started on Port ${process.env.PORT}`);
});
