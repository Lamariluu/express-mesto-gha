const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');
const { createUserValidation, loginValidation } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);
router.use((req, res, next) => {
  next(new NotFoundError('This page does not exist'));
});

module.exports = router;
