const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'in-progress', 'completed'] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

// This could have been in a service layer
const Task = mongoose.model('Task', taskSchema);

// pagination implementation
const getAllTasks = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const tasks = await Task.find()
        .skip(skip)
        .limit(limit);

    const totalTasks = await Task.countDocuments();
    const totalPages = Math.ceil(totalTasks / limit);

    return {
        tasks,
        totalTasks,
        totalPages,
        currentPage: page,
    };
};

const getTaskById = async (id) => {
    return await Task.findById(id);
};

const createTask = async (title, description, status) => {
    const task = new Task({ title, description, status });
    return await task.save();
};

const updateTask = async (id, title, description, status) => {
    return await Task.findByIdAndUpdate(
        id,
        { title, description, status, updated_at: Date.now() },
        { new: true }
    );
};

const deleteTask = async (id) => {
    return await Task.findByIdAndDelete(id);
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};
