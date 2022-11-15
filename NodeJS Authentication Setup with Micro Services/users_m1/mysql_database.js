'use strict';

let mysql = require('mysql');
require('dotenv').config();
// Importing Environment variables from .env files.
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'user';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_DATABASE = process.env.DB_DATABASE || 'LMM_registration';

// Creating Connection with MySQL.
let conn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
});

// Connecting with MySQL.
conn.connect(function (err) {
    if (err) throw err;
    console.log(`Users (Module 1) : MySQL Database is connected Successfully!! DB => ${DB_DATABASE}.`);
});

// Exporting Moduule to use in other files.
module.exports = conn;