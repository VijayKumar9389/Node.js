const mysql = require('mysql');
require('dotenv').config();

//connects to database
const connection = mysql.createPool({
    host: process.env.HOST,
    user: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

//tests connection
connection.getConnection(function(error) {
    if(error){
        console.log("Error connecting to the Database");
        console.log(error);
    } else {
        console.log("Successfully connected to the Database");
    }
});

module.exports = connection;