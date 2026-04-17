const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  create,
  getAll,
  get,
  update,
  deleteCourt,
} = require("../controllers/courts");

router.post("/create", verifyJwtToken, create);
router.get("/getAll", verifyJwtToken, getAll);
router.get("/get/:id", verifyJwtToken, get);
router.put("/update/:id", verifyJwtToken, update);
router.delete("/delete/:id", verifyJwtToken, deleteCourt);

module.exports = router;
