const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  title: { type: Object, required: false },
  body: { type: Object, required: false },
});

module.exports = nutritionSchema;
