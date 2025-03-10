// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all blog posts (publik)
router.get('/', async (req, res) => {
  try {
    const [posts] = await db.promise().query('SELECT * FROM blog_posts');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single blog post (publik)
router.get('/:id', async (req, res) => {
  try {
    const [posts] = await db.promise().query('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    if (posts.length === 0) return res.status(404).json({ message: 'Blog post not found' });
    res.status(200).json(posts[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create blog post (admin only)
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  const { title, content, author_id } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO blog_posts (title, content, author_id) VALUES (?, ?, ?)',
      [title, content, author_id]
    );
    res.status(201).json({ id: result.insertId, title, content, author_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update blog post (admin only)
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  const { title, content } = req.body;
  try {
    const [result] = await db.promise().query(
      'UPDATE blog_posts SET title = ?, content = ? WHERE id = ?',
      [title, content, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json({ id: req.params.id, title, content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete blog post (admin only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const [result] = await db.promise().query(
      'DELETE FROM blog_posts WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
