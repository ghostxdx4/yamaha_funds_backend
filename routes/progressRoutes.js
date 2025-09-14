// backend/routes/progressRoutes.js
const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

// Get from DB
router.get("/", progressController.getProgress);

// Sync Google Sheet -> DB
router.get("/sync-sheet", progressController.syncFromSheet);

module.exports = router;
