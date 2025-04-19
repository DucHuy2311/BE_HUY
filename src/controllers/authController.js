const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { username, password, email, full_name, phone } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create({
      username,
      password: hashedPassword,
      email,
      full_name,
      phone,
      role: 'customer'
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user_id: userId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    await User.updateLastLogin(user.user_id);
    
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};
