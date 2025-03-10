const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', (req, res) => {
    const query = 'SELECT * FROM events';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json(results);
        }
    });
});

router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM events WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ error: 'Server error' });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Event not found' });
        } else {
            res.json(results[0]);
        }
    });
});

router.post('/', authenticate, authorize(['admin']), (req, res) => {
    const { title, school, event, date, content, url_picture } = req.body;
    const query = `
        INSERT INTO events 
        (title, school, event, date, content, url_picture) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, 
        [title, school, event, date, content, url_picture], 
        (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).json({ error: 'Server error' });
            } else {
                res.status(201).json({
                    id: results.insertId,
                    ...req.body
                });
            }
        });
});

router.put('/:id', authenticate, authorize(['admin']), (req, res) => {
    const { title, school, event, date, content, url_picture } = req.body;
    const query = `
        UPDATE events SET
        title = ?,
        school = ?,
        event = ?,
        date = ?,
        content = ?,
        url_picture = ?
        WHERE id = ?
    `;
    
    db.query(query,
        [title, school, event, date, content, url_picture, req.params.id],
        (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).json({ error: 'Server error' });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Event not found' });
            } else {
                res.json({
                    id: req.params.id,
                    ...req.body
                });
            }
        });
});

router.delete('/:id', authenticate, authorize(['admin']), (req, res) => {
    const query = 'DELETE FROM events WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ error: 'Server error' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Event not found' });
        } else {
            res.status(204).send();
        }
    });
});

module.exports = router;