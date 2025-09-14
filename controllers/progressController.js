// backend/controllers/progressController.js
const Progress = require("../models/Progress");
const { fetchDonations } = require("../services/googleSheetsService");

const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne();
    if (!progress) {
      progress = await new Progress().save();
    }
    res.json(progress);
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
};

const syncFromSheet = async (req, res) => {
  try {
    const { bikeRaised, donorCount, droneRaised, overflow } = await fetchDonations();

    let progress = await Progress.findOne();
    if (!progress) {
      progress = new Progress();
    }

    progress.bikeRaised = bikeRaised;
    progress.donorCount = donorCount;
    progress.droneRaised = droneRaised;
    await progress.save();

    res.json({ message: "Sheet synced", progress, overflow });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Failed to sync sheet" });
  }
};

module.exports = { getProgress, syncFromSheet };
