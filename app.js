const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.use('/events', require('./routes/eventRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes')); // Tambahkan 

module.exports = app;