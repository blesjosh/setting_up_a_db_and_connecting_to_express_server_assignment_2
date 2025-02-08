const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./schema'); // Import the User model from schema.js

dotenv.config();

const app = express();
const port = process.env.PORT || 3010;

app.use(express.static('static'));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database:', err));


// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// Add a POST endpoint for users
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields (name, email, password) are required' });
    }

    const user = new User({ name, email, password });
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
