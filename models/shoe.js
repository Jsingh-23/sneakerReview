const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shoeSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  designer: {type: Schema.Types.ObjectId, ref:"Designer"},
  author: {
    id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
    },
    username: String
  },
  comments: [
    [
      {
       type: String
      },
      {
       type: String
      },
    ],
  ],
  image: {type: String} });

shoeSchema.virtual("url").get(function () {
  return `/catalog/shoe/${this.id}`;
});

module.exports = mongoose.model("Shoe", shoeSchema);