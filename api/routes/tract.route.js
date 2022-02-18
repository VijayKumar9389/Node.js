const express = require("express");
const router = express.Router();

const tractController = require("../controller/tract.controller");
const {validateToken} = require("../middleware/Auth");

const { id } = require("../models/tract.model");
const { tractNo } = require("../models/tract.model");
const { name } = require("../models/tract.model");

router.get('/', validateToken, tractController.getTractList);
router.get('/id/:id', validateToken, tractController.getTractbyID);
router.get('/tractNo/:tractNo', validateToken, tractController.getTractbyNo);
router.get('/name/:name', validateToken, tractController.getTractbyName);
router.get('/cluster/:name', validateToken, tractController.getRelationCluster);
router.get('/Locations', validateToken, tractController.getAllLocations);

module.exports = router