const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const redis = require("../db/redis")


async function authUser(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const isTokenBlackListed = await redis.get(`blacklist:${token}`)

    if (isTokenBlackListed) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (err) {

        return res.status(401).json({ message: 'Unauthorized' })

    }

}


module.exports = {
    authUser
}