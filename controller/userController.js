const userModel = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "NOTEAPI";

const multer = require('multer');
const path = require('path');

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const profilePhoto = req.file ? req.file.filename : null; 

    try {
        const existUser = await userModel.findOne({ email: email });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userModel.create({
            email: email,
            password: hashedPassword,
            username: username,
            profilePhoto: profilePhoto,
        });

        const token = jwt.sign({ email: result.email, id: result.id }, SECRET_KEY);
        res.status(200).json({ user: result, token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const signin = async (req, res) => {
    const {email, password} = req.body;
    try{
        const existUser = await userModel.findOne({ email: email });
        if (!existUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const matchPassword= await bcrypt.compare(password, existUser.password);
        if (!matchPassword){
            return res.status(400).json({message:"Wrong password"});
        }
        const token = jwt.sign({ email: existUser.email, id: existUser.id }, SECRET_KEY);
        console.log("Login"+existUser);
        res.status(201).json({ "message":"success",user: existUser, token: token });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}


const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};


const getMessageHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const messages = await messageModel.find({
            $or: [
                { senderId: userId },
                { receiverId: userId },
            ],
        }).sort({ dateTime: 'asc' });

        res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getUserFromToken = (token) => {
    try {
        const decodedData = jwt.verify(token, SECRET_KEY);
        return decodedData;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getAllUsers = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const authenticatedUser = getUserFromToken(token);
        if (!authenticatedUser) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const users = await userModel.find({ _id: { $ne: authenticatedUser.id } }, '_id username');
        res.status(200).json({"users":users});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


module.exports = { signin, signup,logout,getMessageHistory,getAllUsers };