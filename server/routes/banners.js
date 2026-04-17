const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  create,
  getAll,
  get,
  // update,
  deleteBanner,
} = require("../controllers/banners");

router.post("/create", verifyJwtToken, create);
router.get("/getAll", verifyJwtToken, getAll);
router.get("/get/:id", verifyJwtToken, get);
// router.put("/update/:id", isAdmin, update);
router.delete("/delete/:id", verifyJwtToken, deleteBanner);

module.exports = router;
