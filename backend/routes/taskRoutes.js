const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, taskController.createTask);
router.put('/:id', auth, taskController.editTask);
router.delete('/:id', auth, taskController.deleteTask);
router.get('/', auth, taskController.getAllTasks); // para listar tareas del usuario


module.exports = router;
