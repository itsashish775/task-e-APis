const { body, query, param } = require('express-validator');

const statusEnum = ['pending', 'in_progress', 'done'];

exports.registerValidator = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];

exports.loginValidator = [
  body('email').isEmail(),
  body('password').notEmpty()
];

exports.taskCreateValidator = [
  body('title').notEmpty(),
  body('description').optional().isString(),
  body('status').optional().isIn(statusEnum)
];

exports.taskUpdateValidator = [
  body('title').optional().notEmpty(),
  body('status').optional().isIn(statusEnum)
];

exports.paginationValidator = [
  query('page').optional().toInt().isInt({ min: 1 }),
  query('limit').optional().toInt().isInt({ min: 1, max: 100 })
];

exports.idParam = [param('id').toInt().isInt({ min: 1 })];
