const express = require('express');
const { signin, signup, logout, getMessageHistory, getAllUsers } = require('../controller/userController');
const userRouter = express.Router();
const upload = require('../config/multer');

userRouter.post('/signup', upload.single('profilePhoto'), signup);
userRouter.post('/signin',signin);
userRouter.post('/logout',logout);
userRouter.get('/all-users', getAllUsers);
userRouter.get('/messages/:userId', getMessageHistory);


module.exports = userRouter;