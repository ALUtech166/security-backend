const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const user = req.body;

    // Check for required fields
    if (!user.email || !user.username || !user.password || !user.passwordConf || !user.role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // Create a new user
    const newUser = new User({
      email: user.email,
      username: user.username,
      password: user.password,
      passwordConf: user.passwordConf,
      role: user.role,
    });

    await newUser.save();
    return res.status(201).json({ message: 'Registration successful, you can now log in.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login a user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Email is not registered' });
    }

    // Check password
    if (user.password === password) {
      // Successful login
      req.session.userId = user.unique_id;
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Wrong password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
