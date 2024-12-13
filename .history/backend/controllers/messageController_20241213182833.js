const Conversation = require("../models/conversationModel.js");
const Message = require("../models/messageModel.js");
const {io, getReceiverSocketId} = require("../socket/socket.js");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user.id;

    // Check for an existing conversation
    let conversation = await Conversation.findOne({
      $or: [
        { participants: { $all: [senderId, receiverId] } },
        { addedUser: senderId },
      ],
    });

    // Check if the sender is blocked by the receiver
    const isBlocked = conversation?.block.some(
      (block) =>
        block.blocker.toString() === receiverId &&
        block.blockedUser.toString() === senderId
    );

    if (isBlocked) {
      return res.status(403).json({ msg: "You have been blocked by the user." });
    }

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    // If the sender was previously added but not a full participant
    if (conversation.addedUser?.toString() === senderId) {
      conversation.participants.push(senderId);
      conversation.addedUser = null; // Remove the addedUser field
    }

    // Create a new message
    const newMessage = await new Message({
      senderId,
      receiverId,
      message,
    }).save();

    // Add the message to the conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Real-time message notification
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Respond with the new message
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("sendMessage Controller error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

  


  const getMessage = async (req, res) => {
    try {
      const userToChatId = req.params.id;
      const senderId = req.user.id;
  
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, userToChatId] },
      }).populate("messages");
  
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
  
      const isBlocked = conversation.block.some(
        (block) => block.blockedUser.toString() === senderId.toString()
      );
  
  
      if (conversation.messages.length === 0) {
        return res.status(204).json("Chats Not Found");
      }
  
      return res.status(200).json(conversation.messages);
    } catch (error) {
      console.error("Error in getting messages:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
module.exports = {sendMessage,getMessage};
