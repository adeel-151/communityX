const User = require('../models/User');

class AuthService {
  async registerUser(userData) {
    const { email } = userData;
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create(userData);
    return user;
  }

  async loginUser(email, password) {
    if (!email || !password) {
      const error = new Error('Please provide an email and password');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    return user;
  }

  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new AuthService();
