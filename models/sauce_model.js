const mongoose = require("mongoose")
const { Schema } = mongoose;
const mongooseErrors = require("mongoose-errors");

// declaration du shema de chaque sauce


const sauceSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true  },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true },
});

sauceSchema.plugin(mongooseErrors);
// export du shema
Model = mongoose.model("Sauce", sauceSchema);

module.exports = Model;
