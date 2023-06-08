const cardsRouter = require('express').Router();
const {
  createCardValidation,
  cardIdValidation,
} = require('../middlewares/validation');
const {
  createCard,
  getCards,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

cardsRouter.post('/', createCardValidation, createCard);
cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', cardIdValidation, deleteCard);
cardsRouter.put('/:cardId/likes', cardIdValidation, addLike);
cardsRouter.delete('/:cardId/likes', cardIdValidation, deleteLike);

module.exports = cardsRouter;
