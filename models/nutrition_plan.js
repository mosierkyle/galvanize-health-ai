const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  title: { type: String, required: false },
  body: { type: String, required: false },
  extra: { type: String, required: false },
});

module.exports = nutritionSchema;
