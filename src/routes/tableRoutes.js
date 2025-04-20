const express = require("express");
const router = express.Router();
const TableController = require("../controllers/tableController");

router.get("/", TableController.getTables);

module.exports = router;
