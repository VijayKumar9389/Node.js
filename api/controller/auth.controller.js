const AuthModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateAccessToken(user){
    return jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '15m' });
}

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
                    const token = generateAccessToken(user);
                    const refreshToken = jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '24hr' });
                    res.send({ auth: true, token: token, refreshToken: refreshToken});
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

    const token = req.headers["x-access-refresh-token"];

    if (!token) {
        res.send({ auth: false })
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.send({ auth: false })
            } else {
                const accessToken = generateAccessToken({username: 'user'})
                res.send({ auth: true, token: accessToken})
            }
        });
    }
}

// logs user out
exports.Logout = (req, res) => {
    req.session.destroy();
}

// exports.Token = (req, res) => {
//     const refreshToken = req.body.token;
// }