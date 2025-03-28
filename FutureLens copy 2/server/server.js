const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Routes
const careerRoutes = require('./routes/careers');
const historyRoutes = require('./routes/history');

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '../client')));

// API endpoints
app.use('/api/careers', careerRoutes);
app.use('/api/history', historyRoutes);

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
