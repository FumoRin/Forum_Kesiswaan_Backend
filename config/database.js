const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'forum_kesiswaan'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MariaDB:', err.message);
    } else {
        console.log('Connected to MariaDB!');
    }
});

module.exports = db;