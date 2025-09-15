const { google } = require("googleapis");

// Load credentials from environment variable
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials, // ✅ use env instead of keyFile
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

async function fetchDonations() {
  const spreadsheetId = process.env.SHEET_ID;
  const range = "'Form responses 1'!A2:E";

  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = response.data.values || [];

  let bikeRaised = 0;
  let donorCount = 0;
  let droneRaised = 0;
  let overflow = 0;

  rows.forEach((row) => {
    const amount = parseFloat(row[2] || 0); // Column C (index 2)
    if (!isNaN(amount) && amount > 0) {
      donorCount++;

      if (bikeRaised < 500000) {
        const needed = 500000 - bikeRaised;
        const applied = Math.min(amount, needed);
        bikeRaised += applied;

        const leftover = amount - applied;
        if (leftover > 0) {
          if (droneRaised < 100000) {
            const droneNeeded = 100000 - droneRaised;
            const appliedDrone = Math.min(leftover, droneNeeded);
            droneRaised += appliedDrone;
            overflow += leftover - appliedDrone;
          } else {
            overflow += leftover;
          }
        }
      } else {
        if (droneRaised < 100000) {
          const droneNeeded = 100000 - droneRaised;
          const appliedDrone = Math.min(amount, droneNeeded);
          droneRaised += appliedDrone;
          overflow += amount - appliedDrone;
        } else {
          overflow += amount;
        }
      }
    }
  });

  return { bikeRaised, donorCount, droneRaised, overflow };
}

module.exports = { fetchDonations };
