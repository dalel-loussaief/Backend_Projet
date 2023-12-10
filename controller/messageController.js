const messageModel = require("../model/message");
const userModel = require("../model/user");

const getMessages = async (req, res) => {
    try {
      const { senderId, receiverId } = req.query;
      const messages = await messageModel.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ createdAt: 1 });
  
      const messagesWithSenderInfo = messages.map(message => ({
        ...message.toObject(),
        isSender: message.senderId === senderId,
      }));
  
      console.log('Query Result:', messagesWithSenderInfo);
      res.json({ "messages": messagesWithSenderInfo });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
module.exports = { getMessages,  };