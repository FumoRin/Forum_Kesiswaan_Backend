const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }
  const searchQuery = `%${query}%`;

  try {
    const [blogs] = await db.promise().query(
      'SELECT * FROM blog_posts WHERE title LIKE ? OR content LIKE ?',
      [searchQuery, searchQuery]
    );
    const [users] = await db.promise().query(
      'SELECT id, email, full_name FROM users WHERE full_name LIKE ? OR email LIKE ?',
      [searchQuery, searchQuery]
    );

    res.status(200).json({ blogs, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
