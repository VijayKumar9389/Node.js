const AuthModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//creates access token
function generateAccessToken(user) {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '8hr' });
}

//Login into account
exports.Login = (req, res) => {

    const userCridentials = req.body

    AuthModel.Login(userCridentials, (err, user) => {

        if (err) res.send(err);

        //checks if any results are returned from DB
        if (user.length > 0) {

            var string = JSON.stringify(user[0]);
            var json = JSON.parse(string);

            //decrypts password from the database 
            bcrypt.compare(userCridentials.password, user[0].PASSWORD, (err, response) => {
                if (response) {
                    //generates tokens
                    const token = generateAccessToken(json);
                    const refreshToken = jwt.sign(json, process.env.JWT_REFRESH_SECRET, { expiresIn: '8hr' });
                    //sends tokens
                    res.send({ auth: true, token: token, refreshToken: refreshToken });
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

    const token = req.headers["refresh-token"];
    const user = jwt.decode(token);

    //checks if clients has a valid refresh token
    if (!token) {
        res.send({ auth: false });
    } else {
        //verifys refresh token
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decode) => {
            if (err) {
                res.send({ auth: false });
            } else {
                //returns a new access token
                const accessToken = generateAccessToken(user);
                res.send({ auth: true, token: accessToken });
            }
        });
    }
}

// logs user out
exports.Logout = (req, res) => {
    const token = req.headers["refresh-token"];
}

exports.getUsers = (req, res) => {
    AuthModel.getUsers((err, users) => {
        if (err)
            res.send(err);
        console.log("stakeholders", users)
        res.send(users);
    });
}

exports.getProjects = (req, res) => {
    AuthModel.getProjects((err, projects) => {
        if (err) {
            res.send(err);
        } else {
            const projectNames = projects.map((project) => project.Tables_in_SRM);
            console.log(projectNames);
            res.send(projectNames);
        }
    });
};




