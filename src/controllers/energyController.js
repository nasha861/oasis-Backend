const asyncHandler = require('express-async-handler');
const { sendSuccess } = require('../utils/apiResponse');

const getEnergyUsage = asyncHandler(async (req, res) => {
  const energy = await Energy.findOne({ author: req.user._id }).sort('-date');

  if (energy) {
    const formatted = energy.readings.map((r) => ({
      label: r.time,
      production: r.production,
      usage: r.usage
    }));

    return sendSuccess(res, formatted, 'Energy usage fetched');
  }

  // fallback mock data
  const usage = [
    { label: '08:00', production: 42, usage: 26 },
    { label: '10:00', production: 58, usage: 31 },
    { label: '12:00', production: 73, usage: 35 },
    { label: '14:00', production: 69, usage: 40 },
    { label: '16:00', production: 52, usage: 38 },
    { label: '18:00', production: 33, usage: 29 }
  ];

  sendSuccess(res, usage, 'Energy usage fetched');
});

module.exports = {
  getEnergyUsage
};