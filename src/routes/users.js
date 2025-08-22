const express = require('express');
const { registerValidator, loginValidator } = require('../validation/validators');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerValidator, userController.register);
router.post('/login', loginValidator, userController.login);

module.exports = router;
