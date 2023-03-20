const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const argon2 = require('argon2');

const pull = require('../db/connection');

const randomBytesAsync = promisify(require('crypto').randomBytes);
const verifyAsync = promisify(jwt.verify);

exports.signIn = async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    res.status(400).send('Данные не указаны');
  }

  try {
    const [userData] = await pull.query(
      'SELECT id, email, firstname, lastname, password FROM diplom.users WHERE email = ?',
      [email],
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

    if (await argon2.verify(passwordHash, password)) {
      const token = jwt.sign(
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
      res.status(400).send('Неправильный логин или пароль');
    }
  } catch (error) {
    console.error(error);
  }
};

exports.signUp = async (req, res) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body;

  if (!firstName || !lastName || !email || !password || !passwordConfirm) {
    res.status(400).send('Данные не указаны');
  }

  try {
    const [emails] = await pull.query(
      'SELECT email FROM users WHERE email = ?',
      [email],
    );

    if (emails.length > 0) {
      res.status(400).send('Такая почта уже существует');
    } else if (password !== passwordConfirm) {
      res.status(400).send('Пароли не совпадают');
    }

    const salt = await randomBytesAsync(32);
    const passwordHash = await argon2.hash(password, salt);

    const [rows] = await pull.query('INSERT INTO users SET ?', {
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const fullName = `${firstName} ${lastName}`;

    const token = jwt.sign(
      {
        email,
        id: rows.insertId,
        fullName,
      },
      process.env.ACCESS_SECRET_KEY,
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
};

exports.whoAmI = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    res.status(401).send('Требуется авторизация');
  }

  try {
    const userData = await verifyAsync(token, process.env.ACCESS_SECRET_KEY);
    res.status(200).send(userData);
  } catch (error) {
    // TODO: посмотреть как обрабатывать ошибки в Express.
    console.error(error);
  }
};
