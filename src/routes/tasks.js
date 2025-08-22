const express = require('express');
const auth = require('../middleware/auth');
const { taskCreateValidator, taskUpdateValidator, paginationValidator, idParam } = require('../validation/validators');
const taskController = require('../controllers/taskController');

const router = express.Router();
router.use(auth);

router.post('/', taskCreateValidator, taskController.createTask);
router.get('/', paginationValidator, taskController.listTasks);
router.get('/:id', idParam, taskController.getTask);
router.put('/:id', taskUpdateValidator, taskController.updateTask);
router.delete('/:id', idParam, taskController.deleteTask);

module.exports = router;
