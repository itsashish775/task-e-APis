const { validationResult } = require("express-validator");
const { Task } = require("../models");
const messages = require("../constants/messages");
const { Op } = require("sequelize");

const taskController = {
  // Create task
  createTask: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.error("Validation failed", 400, errors.array());

    try {
      console.log(req.body);

      const task = await Task.create({ ...req.body, user_id: req.user.id });
      return res.success({ task }, messages.TASK_CREATED, 201);
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError")
        return res.error(messages.TASK_TITLE_UNIQUE, 409);
      return res.error(messages.TASK_CREATE_FAILED, 500, err.message);
    }
  },

  // List tasks with pagination
  listTasks: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.error("Validation failed", 400, errors.array());

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search;

    try {
      const { count, rows } = await Task.findAndCountAll({
        where: {
          user_id: req.user.id,
          ...(search
            ? {
                [Op.or]: [
                  { title: { [Op.like]: `%${search}%` } },
                  { description: { [Op.like]: `%${search}%` } },
                ],
              }
            : {}),
        },
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

      return res.success({
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        data: rows,
      });
    } catch (err) {
      return res.error("Failed to list tasks", 500, err.message);
    }
  },

  // Get task by ID
  getTask: async (req, res) => {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task) return res.error(messages.TASK_NOT_FOUND, 404);
    return res.success({ task });
  },

  // Update task
  updateTask: async (req, res) => {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task) return res.error(messages.TASK_NOT_FOUND, 404);

    try {
      await task.update(req.body);
      return res.success({ task });
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError")
        return res.error(messages.TASK_TITLE_UNIQUE, 409);
      return res.error(messages.TASK_UPDATE_FAILED, 500, err.message);
    }
  },

  // Delete task
  deleteTask: async (req, res) => {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task) return res.error(messages.TASK_NOT_FOUND, 404);

    await task.destroy();
    return res.success({}, messages.TASK_DELETE_FAILED, 204); // 204 usually returns no content
  },
};

module.exports = taskController;
