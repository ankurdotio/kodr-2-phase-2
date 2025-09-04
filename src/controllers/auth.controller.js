const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../db/cache");


async function registerUser(req, res) {

    const { username, password, email, fullName: { firstName, lastName } } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { username }, { email } ]
    })

    if (isUserAlreadyExists) {
        return res.status(422).json({
            message: "User already exists"
        })
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await userModel.create({
        username,
        password: hashedPassword,
        email,
        fullName: {
            firstName,
            lastName
        }
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    })

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            _id: user._id
        }
    })

}


async function loginUser(req, res) {

    const { username, password, email } = req.body;

    const user = await userModel.findOne({
        $or: [ {
            username
        }, {
            email
        } ]
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    })

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            _id: user._id
        }
    })

}


async function logoutUser(req, res) {

    const token = req.cookies.token;

    const blackListToken = await redis.set("blacklist:" + token, token)

    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    })
}

async function getMe(req, res) {
    const user = req.user;
    res.status(200).json({
        message: "User fetched successfully",
        user
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe
}