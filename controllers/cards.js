const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const {
  handleError,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      const ownerId = card.owner.toString();
      if (ownerId !== userId) {
        // попытка удаления чужой карточки
        throw new ForbiddenError('Нет прав для удаления карточки');
      }
      return card;
    })
    // удаление карточки
    .then((card) => Card.deleteOne(card))
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => handleError(err, next));
};

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Некорректный id'));
      } return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => handleError(err, next));
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Некорректный id'));
      } return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => handleError(err, next));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
