const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/',authenticateToken,tasksController.getAllTasks);
router.get('/:id',authenticateToken, tasksController.getTaskById);
router.post('/',authenticateToken, tasksController.createTask);
router.put('/:id',authenticateToken,tasksController.updateTask);
router.delete('/:id',authenticateToken, (req, res) => {
    res.json({ message: `Task ${req.params.id} has been deleted` });
}, tasksController.deleteTask);

module.exports = router;
