const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  // проверка наличия токена
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  try {
    // верификация токена
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  // добавление пейлоуд токена в объект запроса
  req.user = payload;
  return next();
};

module.exports = auth;
