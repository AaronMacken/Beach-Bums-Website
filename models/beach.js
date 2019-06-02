var mongoose = require("mongoose");
// schema
let beachSchema = new mongoose.Schema({
  name: String,
  image: String,
  content: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});
// return model
module.exports = mongoose.model("Beach", beachSchema);
