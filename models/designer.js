const mongoose = require('mongoose');

const schema = mongoose.Schema;

const designerSchema = new Schema({
  name: {type: String, required: true, maxLength: 100},
});

module.exports = mongoose.model("Designer", designerSchema);