const { registerUser, loginUser } = require('../controllers/authController');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

jest.mock('../services/authService');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res;
  let consoleErrorMock;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  afterEach(() => {
    consoleErrorMock.mockRestore(); 
  });

  describe('registerUser', () => {
    test('should register a new user and return userId', async () => {
      const mockUser = { _id: 'user123' };
      req.body = { username: 'testuser', password: 'password123' };

      authService.registerUser.mockResolvedValue(mockUser);

      await registerUser(req, res);

      expect(authService.registerUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ userId: 'user123' });
    });

    test('should return 500 if registration fails', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      authService.registerUser.mockRejectedValue(new Error('Registration failed'));

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Registration failed' });
    });
  });

  describe('loginUser', () => {
    test('should log in user and return token', async () => {
      const mockUser = { _id: 'user123' };
      req.body = { username: 'testuser', password: 'password123' };
      authService.loginUser.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mockToken');

      await loginUser(req, res);

      expect(authService.loginUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });

    test('should return 401 if login fails', async () => {
      req.body = { username: 'testuser', password: 'wrongpassword' };
      authService.loginUser.mockRejectedValue(new Error('Invalid credentials'));

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
});
