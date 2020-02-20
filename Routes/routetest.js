require("dotenv").config();
const express = require("express");
const router = express.Router();

router.post("/comics", async (req, res) => {
  try {
    res.json("route ok");
  } catch (error) {}
});

module.exports = router;
