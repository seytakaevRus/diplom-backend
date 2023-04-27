import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRouter from './routes/auth';
import coursesRouter from './routes/courses';
import lessonsRouter from './routes/lessons';
import reviewsRouter from './routes/reviews';
import testQuestionsRouter from './routes/testQuestions'

const app = express();

dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_ORIGIN_URL,
  }),
);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/courses', coursesRouter);
app.use('/lessons', lessonsRouter);
app.use('/reviews', reviewsRouter);
app.use('/test-questions', testQuestionsRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server started on Port ${process.env.PORT}`);
});
