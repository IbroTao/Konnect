const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid("production", "test", "development").required(),
  PORT: Joi.number().default(3000),
  MONGO_URL: Joi.string().required().description("MongoDB URL"),
  JWT_SECRET: Joi.string().required().description("JWT Secret Key"),
});
