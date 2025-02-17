const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/events', (req, res) => {
    const query = 'SELECT * FROM events';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

module.exports = router;