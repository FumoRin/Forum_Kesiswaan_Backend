const express = require('express');
const app = express();

// Import routes
const eventRoutes = require('./routes/eventRoutes');

// Use routes
app.use('/', eventRoutes);

module.exports = app;