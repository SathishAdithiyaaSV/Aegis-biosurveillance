const mongoose = require('mongoose');

const ReadinessSchema = new mongoose.Schema({
  level: { type: String, enum: ['National', 'State', 'District'], required: true },
  location: { type: String, required: true }, // e.g. "Kerala", "Ernakulam"

  organization: String,
  status: { type: String, enum: ['Ready', 'Standby', 'Mobilizing', 'Engaged'] },
  personnel: String,
  equipment: String,
  updateTime: String
}, { collection: 'readiness_data' });

module.exports = mongoose.model('Readiness', ReadinessSchema);
