const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all todos with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    try {
        const [todos] = await db.query('SELECT * FROM todos LIMIT ? OFFSET ?', [limit, offset]);
        const [countResult] = await db.query('SELECT COUNT(*) AS count FROM todos');
        const totalCount = countResult[0].count;

        res.render('index', {
            todos,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (err) {
        res.status(500).send('Database error: ' + err.message);
    }
});

// Add a new todo
router.post('/add', async (req, res) => {
    const { title, description, due_date } = req.body;
    try {
        await db.query(
            'INSERT INTO todos (title, description, due_date) VALUES (?, ?, ?)',
            [title, description, due_date]
        );
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Database error: ' + err.message);
    }
});

// Mark a todo as important
router.post('/important/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE todos SET important = NOT important WHERE id = ?',
            [id]
        );
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Database error: ' + err.message);
    }
});

// Delete a todo
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM todos WHERE id = ?', [id]);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Database error: ' + err.message);
    }
});

// Search todos
router.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const [todos] = await db.query('SELECT * FROM todos WHERE title LIKE ?', [`%${q}%`]);
        res.render('index', { todos, currentPage: 1, totalPages: 1 });
    } catch (err) {
        res.status(500).send('Database error: ' + err.message);
    }
});

module.exports = router;
