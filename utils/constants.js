const http2 = require('node:http2');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
} = http2.constants;

const handleError = (err, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return next(new BadRequestError('Данные некоректны'));
  }
  if (err.name === 'DocumentNotFoundError') {
    return next(new NotFoundError('Пользователь с данным id не существует'));
  }
  return next(err);
};

module.exports = {
  handleError,
  HTTP_STATUS_OK, // 200
  HTTP_STATUS_CREATED, // 201
  HTTP_STATUS_NOT_FOUND, // 400
};
