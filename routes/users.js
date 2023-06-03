const usersRouter = require('express').Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.patch('/me', updateProfile);

module.exports = usersRouter;
