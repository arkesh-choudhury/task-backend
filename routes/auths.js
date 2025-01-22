const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');


router.post('/login', loginUser);
router.post('/register', registerUser);


// router.get('/test', (req, res) => {
//     res.json({ message: "Hello" });
// });



// router.get('/protected',  authenticateToken, (req, res) => {
//     res.json({ message: `Hello, user ${req.user.id}` });
// });

module.exports = router;
