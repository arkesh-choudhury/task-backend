require('dotenv').config();
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
}


async function registerUser(req, res) {
    // console.log('Request body:', req.body);  

    const { username, password } = req.body;

    try {
        const newUser = await authService.registerUser(username, password);
        res.status(201).json({ userId: newUser._id });
    } catch (error) {
        console.error('Mongoose Error:', error.message); 
        res.status(500).json({ message: error.message });
    }
}



async function loginUser(req, res) {
    const { username, password } = req.body;

    try {
        const user = await authService.loginUser(username, password);
        const token = generateToken(user._id);
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: error.message });
    }
}

module.exports = { registerUser, loginUser };
