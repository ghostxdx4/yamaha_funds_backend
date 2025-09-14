const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  bikeGoal: { type: Number, default: 500000 },
  bikeRaised: { type: Number, default: 0 },
  donorCount: { type: Number, default: 0 },
  droneGoal: { type: Number, default: 100000 },
  droneRaised: { type: Number, default: 0 },
  overflow: { type: Number, default: 0 },
  updates: [{ text: String, date: { type: Date, default: Date.now } }],
});

module.exports = mongoose.model("Progress", progressSchema);
