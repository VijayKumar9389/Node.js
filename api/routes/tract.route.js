const express = require("express");
const router = express.Router();
const tractController = require("../controller/tract.controller");
const {validateToken} = require("../middleware/Auth");

const { id } = require("../models/tract.model");
const { tractNo } = require("../models/tract.model");
const { name } = require("../models/tract.model");
const { project } = require("../models/tract.model");
const Uploader = require('../middleware/upload');

router.get('/', validateToken, tractController.getTractList);
router.get('/tractCluster', validateToken, tractController.getTractCluster);
router.get('/id/:id', validateToken, tractController.getTractbyID);
router.get('/tractNo/:tractNo', validateToken, tractController.getTractbyNo);
router.get('/name/:name', validateToken, tractController.getTractbyName);
router.get('/cluster/:name/:project', validateToken, tractController.getRelationCluster);
router.get('/report/:project', validateToken, tractController.getReport);
router.put('/update/:project', validateToken, tractController.updateTract);
router.get('/getExcel/download', validateToken, tractController.getExcel);
router.post('/excel/compare', validateToken, tractController.compareBook);

module.exports = router;