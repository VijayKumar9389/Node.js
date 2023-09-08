const express = require("express");
const router = express.Router();
const {validateToken} = require("../middleware/Auth");
const stakeholderController = require("../controller/stakeholder.controller");

const { name } = require("../models/stakeholder.model");
const { project } = require("../models/stakeholder.model");

router.get('/getall/:project', validateToken, stakeholderController.getStakeholderList);
router.get('/:name', validateToken, stakeholderController.getStakeholderbyName);
router.get('/connections/:name/:project', validateToken, stakeholderController.getConnections);
router.get('/relations/:name/:project', validateToken, stakeholderController.getRelations);

router.get('/routes/get/:project', validateToken, stakeholderController.getRoutes);
router.get('/sidebar/locations/:project', validateToken, stakeholderController.getAllLocations);
router.get('/sidebar/routes', validateToken, stakeholderController.getStakeholderbyRoute);
router.put('/update/:project', validateToken, stakeholderController.updateStakeholder);

module.exports = router;