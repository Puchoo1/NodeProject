const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Replace with your username
    password: '', // Replace with your password
    database: 'todo_app',
});

module.exports = pool;
