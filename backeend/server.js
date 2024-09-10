const express = require('express');
const cors = require('cors'); // Import the cors package
const sequelize = require('./config/database.js');
const User = require('./models/User');
const Task = require('./models/Task');
const authRoutes = require('./routes/auth'); // Update with the correct path to your auth routes
const taskRoutes = require('./routes/tasks'); // Update with the correct path to your task routes

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);  // For authentication routes
app.use('/api/task', taskRoutes); // For task management routes
require('./models/associations');

// Sync database
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connected and synced');
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
