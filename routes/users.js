const usersRouter = require('express').Router();
const {
  getUserByIdValidation,
  updateAvatarValidation,
  updateProfileValidation,
} = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  updateAvatar,
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserByIdValidation, getUserById);
usersRouter.patch('/me/avatar', updateAvatarValidation, updateAvatar);
usersRouter.patch('/me', updateProfileValidation, updateProfile);
usersRouter.get('/me', getCurrentUser);

module.exports = usersRouter;
