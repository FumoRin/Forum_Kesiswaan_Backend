const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'forum_kesiswaaan',
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MariaDB:', err.message);
    } else {
        console.log('Connected to MariaDB!');
    }
});

module.exports = db;

