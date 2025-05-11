const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path'); // Import the path module

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, '../'), { maxAge: 0 })); // Serve static files from the parent directory


mongoose.connect('mongodb://localhost:27017/recipeApp')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: { type: Array, default: [] },
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  console.log('Raw request body:', req.body); // Debug log
  const { username, password } = req.body;

  if (!username || !password) {
    
    return res.status(400).send('Username and password are required');
  }

  console.log('Parsed registration request:', { username, password }); 

  // Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    
    return res.status(400).send('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);


  const user = new User({ username, password: hashedPassword, favorites: [] });
  try {
    await user.save();
    console.log('User saved to database:', user);
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});


app.post('/login', async (req, res) => {
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

    const token = jwt.sign({ username: user.username }, 'SECRET_KEY');
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

app.get('/test-db', async (req, res) => {
  try {
    console.log('Fetching users from database...'); // Debug log
    const users = await User.find();
    console.log('Users fetched:', users); // Debug log
    res.json(users);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection error');
  }
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'SECRET_KEY', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


app.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      console.error('User not found:', req.user.username); // Debug log
      return res.status(404).send('User not found');
    }
    console.log('Fetched favorites:', user.favorites); // Debug log
    res.json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).send('Error fetching favorites');
  }
});


app.post('/favorites', authenticateToken, async (req, res) => {
  const { recipe } = req.body;
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      console.error('User not found:', req.user.username); // Debug log
      return res.status(404).send('User not found');
    }
    user.favorites.push(recipe);
    await user.save();
    console.log('Updated favorites:', user.favorites); // Debug log
    res.status(200).send('Recipe added to favorites');
  } catch (error) {
    console.error('Error saving favorite:', error);
    res.status(500).send('Error saving favorite');
  }
});

// Catch-all route to ensure all requests serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});


app.listen(4000, () => console.log('Server running on http://localhost:4000'));