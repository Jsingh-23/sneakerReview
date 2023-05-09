const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShoeSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  designer: {type: Schema.Types.ObjectId, ref:"Designer"},
  image: {type: String} });

module.exports = mongoose.model("Shoe", ShoeSchema);