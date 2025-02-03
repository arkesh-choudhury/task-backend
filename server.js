const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());

app.use(express.json());

// CRUD operations for Task Management
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// Login, Signup, JWT Token
const authRoutes = require('./routes/auths');
app.use('/api/auth', authRoutes);

const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));


app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
