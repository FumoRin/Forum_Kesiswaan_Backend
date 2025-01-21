const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Konfigurasi koneksi MariaDB
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'forum_kesiswaaan', 
});

// Cek koneksi database
db.connect(err => {
    if (err) {
        console.error('Error connecting to MariaDB:', err.message);
    } else {
        console.log('Connected to MariaDB!');
    }
});

// Endpoint untuk mendapatkan data dari tabel `events`
app.get('/events', (req, res) => {
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

// Jalankan server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
