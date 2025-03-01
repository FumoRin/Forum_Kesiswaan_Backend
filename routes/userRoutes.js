// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { authenticate, authorize } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', authenticate, authorize(['admin']), (req, res) => {
    const query = 'SELECT id, email, role, no_hp, full_name, school, created_at FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error:', err.message);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json(results);
        }
    });
});

// Get single user (Admin only)
router.get('/:id', authenticate, authorize(['admin']), (req, res) => {
    const query = 'SELECT id, email, role, no_hp, full_name, school, created_at FROM users WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error:', err.message);
            res.status(500).json({ error: 'Server error' });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(results[0]);
        }
    });
});

// Create user (Admin only)
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { email, password, role, no_hp, full_name, school } = req.body;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = `
            INSERT INTO users 
            (email, password, role, no_hp, full_name, school)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.query(query, 
            [email, hashedPassword, role, no_hp, full_name, school],
            (err, results) => {
                if (err) {
                    console.error('Error:', err.message);
                    res.status(500).json({ error: 'Server error' });
                } else {
                    res.status(201).json({
                        id: results.insertId,
                        email,
                        role,
                        no_hp,
                        full_name,
                        school
                    });
                }
            });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user (Admin only)
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { email, password, role, no_hp, full_name, school } = req.body;
        let updates = [];
        let values = [];
        
        // Construct dynamic query
        if (email) {
            updates.push('email = ?');
            values.push(email);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            values.push(hashedPassword);
        }
        if (role) {
            updates.push('role = ?');
            values.push(role);
        }
        if (no_hp) {
            updates.push('no_hp = ?');
            values.push(no_hp);
        }
        if (full_name) {
            updates.push('full_name = ?');
            values.push(full_name);
        }
        if (school) {
            updates.push('school = ?');
            values.push(school);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        
        values.push(req.params.id);
        
        const query = `
            UPDATE users SET
            ${updates.join(', ')}
            WHERE id = ?
        `;
        
        db.query(query, values, (err, results) => {
            if (err) {
                console.error('Error:', err.message);
                res.status(500).json({ error: 'Server error' });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.json({
                    id: req.params.id,
                    ...req.body
                });
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', authenticate, authorize(['admin']), (req, res) => {
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error:', err.message);
            res.status(500).json({ error: 'Server error' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(204).send();
        }
    });
});

module.exports = router;