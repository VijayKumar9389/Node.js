var Connection = require('../../config/database');

var User = (user) => {
    this.username = user.username;
    this.password = user.password;
    this.project = user.project;
}

User.Login = (user, result) => {
    Connection.query("select * from users where username = ?", user.username, (err, res) => {
        if (err) {
            console.log(err);
            result(null, err);
        } else {
            console.log("Found user");
            result(null, res);
        }
    });
}

User.getUsers = (result) => {
    Connection.query("select username from users", (err, res) => {
        if (err) {
            console.log(err);
            result(null, err);
        } else {
            console.log("Returned All Users");
            result(null, res);
        }
    });
}

User.getProjects = (result) => {
    Connection.query(`show tables where ${process.env.DATABASENAME} REGEXP '^[A-Za-z]+_[0-9]{4}$'`, (err, res) => {
        if (err) {
            console.log(err);
            result(null, err);
        } else {
            console.log("All Projects");
            result(null, res);
        }
    });
}

module.exports = User;