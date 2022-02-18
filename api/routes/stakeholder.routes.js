const express = require("express");
const router = express.Router();
const {validateToken} = require("../middleware/Auth");
const stakeholderController = require("../controller/stakeholder.controller");

const { name } = require("../models/stakeholder.model");

router.get('/', validateToken, stakeholderController.getStakeholderList);
router.get('/:name', validateToken, stakeholderController.getStakeholderbyName);
router.get('/PhoneNO/:name', validateToken, stakeholderController.getMatchingNumbers);
router.get('/Address/:name', validateToken, stakeholderController.getMatchingAddress);
router.get('/Locations', validateToken, stakeholderController.getStakeholderList);
router.put('/update', validateToken, stakeholderController.updateStakeholder);

module.exports = router;