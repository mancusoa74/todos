const express = require("express");
const router = express.Router();
const todosController = require("../controllers/todosController");

router.get("/", todosController.getAllTasks);
router.get("/:taskId", todosController.getTask);
router.post("/", todosController.addTask);
router.put("/:taskId", todosController.updateTask);
router.delete("/:taskId", todosController.deleteTask);

module.exports = router;
