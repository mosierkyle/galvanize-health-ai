const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
  age: { type: String, required: false },
  weight: { type: String, required: false },
  height: { type: String, required: false },
  activity: { type: String, required: false },
  currentFitness: { type: String, required: false },
  other: { type: String, required: false },
});

module.exports = healthSchema;
