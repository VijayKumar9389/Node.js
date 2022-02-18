const jwt = require("jsonwebtoken")
require('dotenv').config();

const validateToken = (req, res, next) => {

    const token = req.headers["x-access-token"];

    if (!token) {
        res.send("User not logged in");
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.json({ auth: false, message: "failed to verify" });
            } else {
                console.log("token verified")
                next();
            }
        });
    }
}

module.exports = {validateToken} 