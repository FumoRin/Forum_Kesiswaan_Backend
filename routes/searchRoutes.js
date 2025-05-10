const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Advanced search endpoint
router.get("/events", async (req, res) => {
  try {
    const { query, eventType, institution, dateFilter } = req.query;

    // Start building the SQL query
    let sql = 'SELECT * FROM events WHERE status = "published"';
    const params = [];

    // Add text search condition if query parameter exists
    if (query) {
      sql +=
        " AND (title LIKE ? OR content LIKE ? OR school LIKE ? OR event LIKE ?)";
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Add event type filter
    if (eventType) {
      sql += " AND event LIKE ?";
      params.push(`%${eventType}%`);
    }

    // Add institution filter
    if (institution) {
      sql += " AND school LIKE ?";
      params.push(`%${institution}%`);
    }

    // Add date filter
    if (dateFilter) {
      const today = new Date().toISOString().split("T")[0];

      if (dateFilter === "upcoming") {
        sql += " AND date >= ?";
        params.push(today);
      } else if (dateFilter === "past") {
        sql += " AND date < ?";
        params.push(today);
      }
    }

    // Order by date (most recent first)
    sql += " ORDER BY date DESC";

    // Execute the query
    const [events] = await db.promise().query(sql, params);

    res.status(200).json(events);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Original search endpoint (keeping for backward compatibility)
router.get("/", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }
  const searchQuery = `%${query}%`;

  try {
    const [events] = await db
      .promise()
      .query(
        'SELECT * FROM events WHERE status = "published" AND (title LIKE ? OR content LIKE ? OR school LIKE ?)',
        [searchQuery, searchQuery, searchQuery]
      );

    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
