const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

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

const authRouter = require('./routes/auth');

app.use('/auth', authRouter);

app.listen(3000, () => {
  console.log('Server started on Port 3000');
});
