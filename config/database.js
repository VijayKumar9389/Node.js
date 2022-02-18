const mysql = require('mysql');
require('dotenv').config();

//connects to database
const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

//tests connection
connection.query(function(error) {
    if(error){
        console.log("Error connecting to the Database");
    } else {
        console.log("Successfully connected to the Database");
    }
});

module.exports = connection;