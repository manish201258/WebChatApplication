const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Messages within the conversation
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [], // Messages are optional initially
      },
    ],
    // One-sided visibility: Keep track of added users before a message is sent
    addedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Blocking information
    block: [
      {
        blocker: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        blockedUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        blockedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
