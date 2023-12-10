const express = require('express');
const messageRouter = express.Router();
const messageController = require('../controller/messageController');

// Endpoint to fetch messages between two users
messageRouter.get('/get-messages', messageController.getMessages);
//messageRouter.get('/get-conversations', messageController.getConversations);
module.exports = messageRouter;