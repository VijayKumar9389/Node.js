const AuthModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//Login into account
exports.Login = (req, res) => {
    const tmp = req.body
    AuthModel.Login(tmp, (err, user) => {
        if (err)
            res.send(err);
        if (user.length > 0) {
            //decrypts password from the database 
            bcrypt.compare(tmp.password, user[0].PASSWORD, (err, response) => {
                if (response) {
                    const id = user[0].ID;
                    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 60 });
                    req.session.user = user;
                    res.send({ auth: true, token: token, user: req.session.user });
                    console.log(user[0].USERNAME + " Logged in successfully");
                } else {
                    res.send({ auth: false, message: "Wrong username or password" });
                }
            });
        } else {
            res.send({ auth: false, message: "No username exist" });
        }
    });
}

// checks session to see if user is logged in
exports.getLogin = (req, res) => {

    const token = req.headers["x-access-token"];

    if (!token) {
        res.send({ auth: false })
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.send({ auth: false })
            } else {
                res.send({ auth: true })
            }
        });
    }


}

// logs user out
exports.Logout = (req, res) => {
    req.session.destroy();
}