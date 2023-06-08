const express = require("express");
const router = express.Router();
const {validateToken} = require("../middleware/Auth");
const surveyController = require("../controller/survey.controller");

const { stakeholder } = require("../models/stakeholder.model");

router.post('/take', validateToken, surveyController.createSurvey);
router.get('/get/:stakeholder', validateToken, surveyController.getSurvey);

module.exports = router;