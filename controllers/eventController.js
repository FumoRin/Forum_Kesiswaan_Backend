const db = require('../config/database');

exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await db.promise().query('SELECT * FROM events');
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const [event] = await db.promise().query('SELECT * FROM events WHERE id = ?', [req.params.id]);
        if (event.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createEvent = async (req, res) => {
    const { title, school, event, date, content, url_picture } = req.body;
    try {
        const [result] = await db.promise().query(
            'INSERT INTO events (title, school, event, date, content, url_picture) VALUES (?, ?, ?, ?, ?, ?)',
            [title, school, event, date, content, url_picture]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    const { title, school, event, date, content, url_picture } = req.body;
    try {
        await db.promise().query(
            'UPDATE events SET title = ?, school = ?, event = ?, date = ?, content = ?, url_picture = ? WHERE id = ?',
            [title, school, event, date, content, url_picture, req.params.id]
        );
        res.status(200).json({ id: req.params.id, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await db.promise().query('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};