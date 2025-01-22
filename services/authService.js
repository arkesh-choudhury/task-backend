const User = require('../models/user');

async function registerUser(username, password) {
    // console.log('Received data:', { username, password }); 
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) throw new Error('User already exists');

        const newUser = new User({ username, password });
        await newUser.save();

        return newUser;
    } catch (error) {
        console.error('Error during user registration:', error.message);  
        throw error;
    }
}

async function loginUser(username, password) {
    try {

        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) throw new Error('Invalid credentials');

        return user; 
    } catch (error) {
        throw error; 
    }
}

module.exports = { registerUser, loginUser };
