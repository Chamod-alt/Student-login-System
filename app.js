


const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // To serve uploaded images

// Use your student router
const studentRouter = require('./routes/studentRouters');
app.use('/api/students', studentRouter);

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
