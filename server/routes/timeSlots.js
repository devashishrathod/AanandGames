const express = require("express");
const router = express.Router();

const { verifyJwtToken } = require("../middlewares");
const { getAll, getCourts } = require("../controllers/timeSlots");

router.get("/getAll", verifyJwtToken, getAll);
router.get("/getCourts", verifyJwtToken, getCourts);

module.exports = router;
