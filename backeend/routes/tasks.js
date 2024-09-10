// routes/tasks.js
const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');


const router = express.Router();

// Create a new task
router.post('/tasks', verifyToken, async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.userId; // Ensure this is being set correctly from the token
  
    try {
      const task = await Task.create({ title, description, user_id: userId });
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: 'Error creating task' });
    }
  });

// Get all tasks for the user
router.get('/tasks', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: [{
                model: User,
                attributes: ['name'] // Include only the 'name' attribute from User
            }]
        });

        // Log the tasks to see the returned structure
        console.log('Fetched tasks:', JSON.stringify(tasks, null, 2));

        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Update a task
router.put('/tasks/:id', verifyToken, async (req, res) => {
    const { title, description } = req.body;
    const taskId = req.params.id;
  
    console.log(`Received PUT request for task ID: ${taskId}`);
  
    try {
      // Fetch the task
      const task = await Task.findByPk(taskId);
      if (!task) {
        console.log(`Task with ID ${taskId} not found`);
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Check authorization
      if (task.user_id !== req.user.userId) {
        console.log(`User ${req.user.userId} not authorized to update task ID ${taskId}`);
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      // Update task details
      task.title = title;
      task.description = description;
      await task.save();
      res.status(200).json(task);
    } catch (err) {
      console.error('Error updating task:', err.message);
      res.status(500).json({ error: 'Error updating task' });
    }
  });


// delete a task
router.delete('/tasks/:id', verifyToken, async (req, res) => {
    const taskId = req.params.id;
    console.log(`Received DELETE request for task ID: ${taskId}`);
  
    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            console.log(`Task with ID ${taskId} not found`);
            return res.status(404).json({ error: 'Task not found' });
        }
  
        await task.destroy();
        console.log(`Task with ID ${taskId} deleted successfully`);
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        console.error('Error deleting task:', err.message);
        res.status(500).json({ error: 'Error deleting task' });
    }
});


  // Get a task by ID
  router.get('/tasks/:id', verifyToken, async (req, res) => {
    const taskId = req.params.id;
  
    try {
      const task = await Task.findByPk(taskId, {
        include: [{ model: User, attributes: ['name'] }] // Include the 'name' attribute from User
      });
  
      if (!task || task.user_id !== req.user.userId) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.json(task);
    } catch (err) {
      console.error('Error fetching task:', err.message);
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  });


module.exports = router;
