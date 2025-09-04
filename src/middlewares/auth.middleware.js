const jwt = require('jsonwebtoken')
const redis = require("../db/cache")
const userModel = require("../models/user.model")

async function authUser(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const isTokenBlackListed = await redis.get(`blacklist:${token}`)

    if (isTokenBlackListed) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const id = decoded.id

        let user = await redis.get(`user:${id}`)

        if (!user) {
            user = await userModel.findOne({ _id: id })
            await redis.set(`user:${id}`, JSON.stringify(user))
        } else {
            user = JSON.parse(user)
        }

        req.user = user

        next()

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

}

module.exports = { authUser };