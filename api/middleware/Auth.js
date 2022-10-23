const jwt = require("jsonwebtoken")
require('dotenv').config();

const validateToken = (req, res, next) => {

    const token = req.headers["access-token"];
    const user = jwt.decode(token);

    if (!token) {
        res.send({auth: false, message: "User not logged in"});
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.json({ auth: false, message: "failed to verify" });
            } else {
                console.log("token verified")
                req.reqUser = user.user.USERNAME;
                next();
            }
        });
    }
}

module.exports = {validateToken} 