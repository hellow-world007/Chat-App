const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
