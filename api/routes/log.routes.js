const express = require("express");
const router = express.Router();
const LogController = require("../controller/log.controller");
const {validateToken} = require("../middleware/Auth");

router.get('/get', LogController.getAllLogs);
router.post('/create', validateToken, LogController.createLog);
router.get('/test', LogController.getLogExcel);

// router.post('/excel/compare', validateToken, Uploader.single('file'), tractController.compareBook);

module.exports = router;