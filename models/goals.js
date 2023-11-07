const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
  overall: { type: String, required: false },
  strength: { type: String, required: false },
  weight: { type: String, required: false },
  other: { type: String, required: false },
});

module.exports = goalsSchema;
