const express = require("express");
const router = express.Router();
const {validateToken} = require("../middleware/Auth");
const stakeholderController = require("../controller/stakeholder.controller");

const { name } = require("../models/stakeholder.model");

router.get('/', validateToken, stakeholderController.getStakeholderList);
router.get('/:name', validateToken, stakeholderController.getStakeholderbyName);
router.get('/connections/:name', validateToken, stakeholderController.getConnections);
router.get('/routes/get', validateToken, stakeholderController.getRoutes);
router.get('/sidebar/locations', validateToken, stakeholderController.getAllLocations);
router.get('/sidebar/routes', validateToken, stakeholderController.getStakeholderbyRoute);
router.put('/update', validateToken, stakeholderController.updateStakeholder);

module.exports = router;