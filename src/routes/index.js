const express = require("express");
const usersRoute = require("./users");
const tasksRoute = require("./tasks");

const router = express.Router();

router.use("/users", usersRoute);
router.use("/tasks", tasksRoute);

module.exports = router;
