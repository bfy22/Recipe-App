const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path'); // Import the path module for cross-compatibility and filepath error prevention

const User = require('./models/user'); 
const authRoutes = require('./routes/authRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');



require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());




app.use(express.static(path.join(__dirname, '../public/'), { maxAge: 0 })); // Serve static files from the parent directory

app.use('/api/auth', authRoutes)
app.use('/api/favorites', favoritesRoutes)

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/recipeApp')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));


/*Database Test
app.get('/test-db', async (req, res) => {
  try {
    console.log('Fetching users from database...'); 
    const users = await User.find();
    //console.log('Users fetched:', users); 
    res.json(users);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection error');
  }
});*/ 


// Catch-all route to ensure all requests serve index.html for SPA
app.get(/^\/(?!api\/|scripts\/|stylesheets\/|images\/).*/, (req, res) => {
  console.log(`Catch-all route triggered for path: ${req.path}`); 
  res.sendFile(path.join(__dirname, '../index.html'));
  
});

//catch to ensure json file is fetched
app.get('/defaultRecipes.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../defaultRecipes.json'));
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));