// eslint-disable-next-line import/no-extraneous-dependencies
const jsonWebToken = require('jsonwebtoken');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const { Error } = require('mongoose');
const User = require('../models/user');
const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  ERROR_UNAUTHORIZED, ERROR_CONFLICT,
} = require('../errors');

// eslint-disable-next-line consistent-return
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (e) {
    const err = new Error('На сервере произошла ошибка');
    err.statusCode = ERROR_INTERNAL_SERVER;
    next(err);
  }
};

// eslint-disable-next-line consistent-return
const getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('Пользователь по указанному _id не найден');
      err.statusCode = ERROR_NOT_FOUND;
      next(err);

      /*      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' }); */
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new Error('Переданы некорректные данные');
      err.statusCode = ERROR_INACCURATE_DATA;
      next(err);

      /*      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные',
      }); */
    }
    const err = new Error('На сервере произошла ошибка');
    err.statusCode = ERROR_INTERNAL_SERVER;
    next(err);
  }
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      res.status(201).send(
        user,
      );
    })
    .catch((e) => {
      if (e.code === 11000) {
        const err = new Error('Пользователь с такими данными уже существует');
        err.statusCode = ERROR_CONFLICT;
        next(err);
      }
      if (e.name === 'ValidationError' || e.name === 'CastError') {
        const err = new Error('Переданы некорректные данные при создании пользователя');
        err.statusCode = ERROR_INACCURATE_DATA;
        next(err);
      }
      next(e);
    });
};

// eslint-disable-next-line consistent-return
const patchUser = async (req, res, next) => {
  /* const userId = req.user._id; */
  const userId = req.cookies.jsonWebToken;
  try {
    const { name, about } = req.body;
    const user = await User.findOneAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      const err = new Error('Пользователь по указанному _id не найден');
      err.statusCode = ERROR_NOT_FOUND;
      next(err);
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      const err = new Error('Переданы некорректные данные при обновлении профиля');
      err.statusCode = ERROR_INACCURATE_DATA;
      next(err);
    }
    next(e);
  }

/*  try {
    const { name, about } = req.body;
    const user = await User.findOneAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    }
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  } */
};

// eslint-disable-next-line consistent-return
const patchUserAvatar = async (req, res, next) => {
  const userId = req.cookies.jsonWebToken;
  try {
    const { avatar } = req.body;
    const user = await User.findOneAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      const err = new Error('Пользователь по указанному _id не найден');
      err.statusCode = ERROR_NOT_FOUND;
      next(err);
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      const err = new Error('Переданы некорректные данные при обновлении профиля');
      err.statusCode = ERROR_INACCURATE_DATA;
      next(err);
    }
    next(e);
  }

/*  try {
    const { avatar } = req.body;
    const user = await User.findOneAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(ERROR_INACCURATE_DATA).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    }
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  } */
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jsonWebToken.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      /* res.status(200).send(token); */
      res.cookie('jsonWebToken', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).end();
    })
    .catch((err) => {
      const e = new Error(`${err.message}`);
      e.statusCode = ERROR_UNAUTHORIZED;
      next(e);

      /* res.status(ERROR_UNAUTHORIZED).send({ message: err.message }); */
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  patchUser,
  patchUserAvatar,
  login,
};
