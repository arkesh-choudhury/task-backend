const taskModel = require('../models/task');

const getAllTasks = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    try {
        const tasks = await taskModel.getAllTasks(page,limit);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await taskModel.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createTask = async (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const newTask = await taskModel.createTask(title, description, status);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTask = async (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const updatedTask = await taskModel.updateTask(req.params.id, title, description, status);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const taskDeleted = await taskModel.deleteTask(req.params.id); 
        if (!taskDeleted) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error in deleteTask:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
