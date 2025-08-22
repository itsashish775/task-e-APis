const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const messages = require('../constants/messages');

const userController = {
  // Register new user
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.error('Validation failed', 400, errors.array());

    try {
      const { name, email, password } = req.body;
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.error(messages.EMAIL_ALREADY_REGISTERED, 409);

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash });

      return res.success({ id: user.id, name, email }, messages.USER_REGISTERED, 201);
    } catch (err) {
      return res.error(messages.REGISTER_FAILED, 500, err.message);
    }
  },

  // Login user
  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.error('Validation failed', 400, errors.array());

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.error(messages.INVALID_CREDENTIALS, 401);

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.error(messages.INVALID_CREDENTIALS, 401);

      const token = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return res.success({ token }, messages.LOGIN_SUCCESS);
    } catch (err) {
      return res.error(messages.LOGIN_FAILED, 500, err.message);
    }
  }
};

module.exports = userController;
