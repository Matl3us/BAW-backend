const { body, query } = require('express-validator');

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

  body('airDate').notEmpty().withMessage('missing air date of the episode'),

  body('showName')
    .notEmpty()
    .withMessage('missing name of the show')
    .isString()
    .withMessage('invalid show name data type'),
];

const validateListBody = [
  body('showId')
    .notEmpty()
    .withMessage('missing show Id')
    .isInt()
    .withMessage('invalid showId data'),
];

const validateLoginBody = [
  body('email')
    .notEmpty()
    .withMessage('missing email address')
    .isEmail()
    .withMessage('invalid email address format'),

  body('password')
    .notEmpty()
    .withMessage('missing password')
    .isString()
    .withMessage('invalid password data type')
    .isLength({ min: 6, max: 100 })
    .withMessage('invalid password length'),
];

const validateRatingBody = [
  body('showId')
    .notEmpty()
    .withMessage('missing show Id')
    .isInt()
    .withMessage('invalid showId data'),

  body('score')
    .notEmpty()
    .withMessage('missing score')
    .isInt({ min: 1, max: 10 })
    .withMessage('invalid score data'),

  body('comment')
    .notEmpty()
    .withMessage('missing comment')
    .isString()
    .withMessage('invalid comment data type')
    .isLength({ max: 1000 })
    .withMessage('invalid comment length'),
];

const validateUpdateRatingBody = [
  body('score')
    .notEmpty()
    .withMessage('missing score')
    .isInt({ min: 1, max: 10 })
    .withMessage('invalid score data'),

  body('comment')
    .notEmpty()
    .withMessage('missing comment')
    .isString()
    .withMessage('invalid comment data type')
    .isLength({ max: 1000 })
    .withMessage('invalid comment length'),
];

const validateSearchQuery = [
  query('search')
    .notEmpty()
    .withMessage('missing search query')
    .isString()
    .withMessage('invalid search query data type')
    .isLength({ max: 20 })
    .withMessage('invalid search query length'),
];

const validateShowBody = [
  body('name')
    .notEmpty()
    .withMessage('missing tv show name')
    .isString()
    .withMessage('invalid tv show name data type')
    .isLength({ max: 256 })
    .withMessage('invalid tv show nam length'),

  body('description')
    .notEmpty()
    .withMessage('missing tv show description')
    .isString()
    .withMessage('invalid tv show description data type')
    .isLength({ max: 2000 })
    .withMessage('invalid description length'),

  body('country')
    .notEmpty()
    .withMessage('missing tv show country')
    .isString()
    .withMessage('invalid tv show country data type')
    .isLength({ max: 10 })
    .withMessage('invalid country length'),

  body('imagePath')
    .notEmpty()
    .withMessage('missing tv show image path')
    .isString()
    .withMessage('invalid tv show image path data type')
    .isLength({ max: 100 })
    .withMessage('invalid tv show image path length'),
];

const validateRegisterBody = [
  body('username')
    .notEmpty()
    .withMessage('missing username')
    .isString()
    .withMessage('invalid username data type')
    .isLength({ min: 6, max: 50 })
    .withMessage('invalid username length'),

  body('email')
    .notEmpty()
    .withMessage('missing email address')
    .isEmail()
    .withMessage('invalid email address format')
    .isLength({ max: 256 })
    .withMessage('invalid email length'),

  body('password')
    .notEmpty()
    .withMessage('missing password')
    .isString()
    .withMessage('invalid password data type')
    .isLength({ min: 6, max: 100 })
    .withMessage('invalid password length'),
];

const validateUpdatePasswordBody = [
  body('newPassword')
    .notEmpty()
    .withMessage('missing new password')
    .isString()
    .withMessage('invalid new password data type')
    .isLength({ min: 6, max: 100 })
    .withMessage('invalid new password length'),

  body('oldPassword')
    .notEmpty()
    .withMessage('missing old password')
    .isString()
    .withMessage('invalid old password data type')
    .isLength({ min: 6, max: 100 })
    .withMessage('invalid old password length'),
];

module.exports = {
  validateEpisodeBody,
  validateListBody,
  validateLoginBody,
  validateRatingBody,
  validateUpdateRatingBody,
  validateSearchQuery,
  validateShowBody,
  validateRegisterBody,
  validateUpdatePasswordBody,
};
