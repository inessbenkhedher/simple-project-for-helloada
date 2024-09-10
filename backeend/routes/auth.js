const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const { isValidEmail } = require('../middleware/validation');
require('dotenv').config();

const router = express.Router();

// Create a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Check password length and lowercase letters
        if (password.length < 8 || !/[a-z]/.test(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one lowercase letter ([a-z])' });
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token in the response
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user name by ID
router.get('/user/:id', async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ['name'] // Only select the 'name' attribute
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ name: user.name }); // Return only the name
    } catch (err) {
      console.error('Error fetching user:', err.message);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

module.exports = router;
