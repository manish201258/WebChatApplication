const Conversation = require('../models/conversationModel.js');
const Message = require('../models/messageModel.js');

const blockChatPerson = async (req, res) => {
    try {
      const blockedUserId  = req.params.id;
      const blockerId = req.user.id;
      const conversation = await Conversation.findOne({
        participants: { $all: [blockerId, blockedUserId] },
      });
  
      if (!conversation) {
        return res.status(404).json({ msg: "Conversation not found" });
      }
  
      const isAlreadyBlocked = conversation.block.some(
        (block) => block.blocker.toString() === blockerId && block.blockedUser.toString() === blockedUserId
      );
  
      if (isAlreadyBlocked) {
        return res.status(400).json({ msg: "User already blocked" });
      }
  
      conversation.block.push({ blocker: blockerId, blockedUser: blockedUserId });
      await conversation.save();
  
      res.status(200).json({ msg: "User blocked successfully" });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  };

//   Unblock

const unblockChatPerson = async(req,res) =>{
    try {
        const blockedUserId  = req.params.id;
        const blockerId = req.user.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [blockerId, blockedUserId] },
          });

        const isAlreadyBlocked = conversation.block.some(
            (block) => block.blocker.toString() === blockerId && block.blockedUser.toString() === blockedUserId
          );

          conversation.block.remove({ blocker: blockerId, blockedUser: blockedUserId });
          await conversation.save();
          res.status(200).json({ msg: "User unblocked successfully" });
    } catch (error) {
        console.log("error in unblocking userconversation");
        res.status(500).json({msg:"server side error"})
    }
}


// All Blocked User Data
  const blockedUserData = async (req, res) => {
      try {
          const loggedUserId = req.user.id;
  
          const conversations = await Conversation.find({
              $or: [
                  { "block.blocker": loggedUserId },
                  { "block.blockedUser": loggedUserId },
              ],
          });
  
          const blockedByUser = [];
          const blockedUsers = [];
  
          conversations.forEach((conversation) => {
              conversation.block.forEach((block) => {
                  if (block.blocker.toString() === loggedUserId.toString()) {
                      blockedUsers.push(block.blockedUser);
                  }
                  if (block.blockedUser.toString() === loggedUserId.toString()) {
                      blockedByUser.push(block.blocker);
                  }
              });
          });
  
          res.status(200).json({
              blockedByUser,
              blockedUsers,
          });
      } catch (error) {
          console.log("Error in fetching blocked user data", error);
          res.status(500).json({ msg: "Server side error" });
      }
  };
  
  module.exports = { blockedUserData };
  

const deleteConversation = async (req, res) => {
  try {
    const chatPersonId = req.params.id;
    const loggedUserId = req.user.id;

    const findConversation = await Conversation.findOne({
      participants: { $all: [loggedUserId, chatPersonId] }
    });

    if (!findConversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }

    // Delete the messages
    await Message.deleteMany({
      $or: [
        { senderId: loggedUserId, receiverId: chatPersonId },
        { senderId: chatPersonId, receiverId: loggedUserId }
      ]
    });

    // Delete the conversation
    await Conversation.deleteOne({ _id: findConversation._id });

    res.status(200).json({ msg: "Conversation and related messages deleted successfully" });

  } catch (error) {
    console.log("Error in deleting conversation:", error);
    res.status(500).json({ msg: "Server side error" });
  }
};

module.exports = { blockChatPerson,unblockChatPerson,blockedUserData, deleteConversation };
