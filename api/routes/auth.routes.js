const express = require("express");
const router = express.Router();
const {validateToken} = require("../middleware/Auth");
const AuthController = require("../controller/auth.controller");

const { username } = require("../models/auth.model");
const { password } = require("../models/auth.model");

router.post("/login", AuthController.Login);
router.get("/login", AuthController.getLogin);
router.get("/logout", AuthController.Logout);
router.get("/users", AuthController.getUsers);

router.get('/isUserAuth', validateToken, (req, res) => {
    res.send({ auth: true, message: "you are authenticatied!" });
});


module.exports = router;