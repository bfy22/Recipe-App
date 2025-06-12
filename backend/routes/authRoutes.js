//backend routing and error-handling of userSession features 
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



router.post('/register', async (req, res) => {
  console.log('Raw request body:', req.body); // Debug log
  const { username, password } = req.body;

  if (!username || !password) {
    
    return res.status(400).send('Username and password are required');
  }

  

  // Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    
    return res.status(400).send('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);


  const user = new User({ username, password: hashedPassword, favorites: [] }); //constructer using User template for user creation
  try {
    await user.save();
    console.log('User saved to database:', user);
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.error('User not found:', username);
      return res.status(401).send('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Invalid password for user:', username);
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

module.exports = router;
