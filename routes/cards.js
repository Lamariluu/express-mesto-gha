const cardsRouter = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

cardsRouter.post('/', createCard);
cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', addLike);
cardsRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardsRouter;
