const Redis = require("ioredis");

/* redis-19147.c264.ap-south-1-1.ec2.redns.redis-cloud.com: */
const redis = new Redis({
    port: 19147,
    host: "redis-19147.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
    password: process.env.REDIS_PASSWORD
})

redis.on("connect", () => {
    console.log("Connected to Redis");
})

module.exports = redis;