const http2 = require('node:http2');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const handleError = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res
      .status(HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Данные некоректны' });
  }
  if (err.name === 'DocumentNotFoundError') {
    return res
      .status(HTTP_STATUS_NOT_FOUND)
      .send({ message: 'Пользователь с данным id не существует' });
  }
  return res
    .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: 'Ошибка сервера' });
};

module.exports = {
  handleError,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
};
