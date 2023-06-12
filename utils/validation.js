const { body } = require('express-validator');

const validateEpisodeBody = [
  body('number')
    .notEmpty()
    .withMessage('missing episode number')
    .isInt({ min: 1 })
    .withMessage('invalid episode number'),

  body('season')
    .notEmpty()
    .withMessage('missing season number')
    .isInt({ min: 1 })
    .withMessage('invalid season number'),

  body('name')
    .notEmpty()
    .withMessage('missing name of the episode')
    .isString()
    .withMessage('invalid name data type')
    .isLength({ max: 256 })
    .withMessage('name is too long'),

  body('airDate')
    .notEmpty()
    .withMessage('missing air date of the episode'),

  body('showName')
    .notEmpty()
    .withMessage('missing name of the show')
    .isString()
    .withMessage('invalid show name data type'),
];

module.exports = { validateEpisodeBody };
