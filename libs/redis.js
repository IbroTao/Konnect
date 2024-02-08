const { redisClient } = require("../configs/redis");

async function addToRedis(key, value, expiresIn = 60 * 60 * 24) {
  try {
    return await redisClient.set(key, value, "EX", expiresIn);
  } catch (error) {
    throw new Error(error);
  }
}

async function addRedisToCaching(key, value, expiresIn = 360) {
  try {
    return await redisClient.setex(key, expiresIn, value);
  } catch (error) {
    throw new Error(error);
  }
}
