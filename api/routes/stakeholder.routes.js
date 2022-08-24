const express = require("express");
const router = express.Router();
const {validateToken} = require("../middleware/Auth");
const stakeholderController = require("../controller/stakeholder.controller");

const { name } = require("../models/stakeholder.model");

router.get('/',  stakeholderController.getStakeholderList);
router.get('/:name', validateToken, stakeholderController.getStakeholderbyName);
router.get('/connections/:name', validateToken, stakeholderController.getConnections);
router.get('/sidebar/locations', validateToken, stakeholderController.getAllLocations);
router.put('/update', validateToken, stakeholderController.updateStakeholder);

module.exports = router;