
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const [result] = await db.promise().query(
      'SELECT id, email, full_name, no_hp, school, role, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    if (result.length === 0) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', authenticate, async (req, res) => {
  const { email, full_name, no_hp, school } = req.body;
  try {
    const [result] = await db.promise().query(
      'UPDATE users SET email = ?, full_name = ?, no_hp = ?, school = ? WHERE id = ?',
      [email, full_name, no_hp, school, req.user.userId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json({ id: req.user.userId, email, full_name, no_hp, school });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

