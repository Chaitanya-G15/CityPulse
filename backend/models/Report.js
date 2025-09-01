const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
