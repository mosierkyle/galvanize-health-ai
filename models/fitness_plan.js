const mongoose = require('mongoose');

const fitnessSchema = new mongoose.Schema({
  title: { type: String, required: false },
  body: { type: String, required: false },
  extra: { type: String, required: false },
});

module.exports = fitnessSchema;
