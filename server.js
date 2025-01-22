const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// CRUD operations for Task Management
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// Login, Signup, JWT Token
const authRoutes = require('./routes/auths');
app.use('/api/auth', authRoutes);

mongoose.connect('mongodb+srv://arkeshchoudhury:R54k7jtKhAiSrJjm@cluster0.xz764.mongodb.net/')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));


app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
