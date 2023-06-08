const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const User = require('../models/user');

const {
  handleError,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../utils/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      } return res.send(user);
    })
    .catch((err) => handleError(err, next));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.status(HTTP_STATUS_OK)
        .send(user);
    })
    .catch((err) => handleError(err, next));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          const noPassword = user.toObject({ useProjection: true });
          res.status(HTTP_STATUS_CREATED).send(noPassword);
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с указанным email уже зарегистрирован'));
          }
          return handleError(err, next);
        });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.status(HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => handleError(err, next));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.status(HTTP_STATUS_OK).send({ avatar });
    })
    .catch((err) => handleError(err, next));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  // поиск пользователя по email
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Некорректные почта или пароль'));
      }
      // проверка правильности пароля
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return next(new UnauthorizedError('Некорректные почта или пароль'));
          }
          // создание JWT с токеном сроком на неделю
          const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
