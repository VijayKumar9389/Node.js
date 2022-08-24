var Connection = require('../../config/database');

var User = (user) => {
    this.username = user.username;
    this.password = user.password;
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

module.exports = User;