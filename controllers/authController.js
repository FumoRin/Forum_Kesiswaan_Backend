const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { email, password, role, no_hp, full_name, school } = req.body;
        
       
        const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.promise().query(
            'INSERT INTO users (email, password, role, no_hp, full_name, school) VALUES (?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, role || 'user', no_hp, full_name, school]
        );

        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user.id,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

    console.log('[DEBUG] JWT_SECRET:', process.env.JWT_SECRET);
};