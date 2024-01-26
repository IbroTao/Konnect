const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid("production", "test", "development").required(),
  PORT: Joi.number().default(3000),
  MONGO_URL: Joi.string().required().description("MongoDB URL"),
  JWT_SECRET: Joi.string().required().description("JWT Secret Key"),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
    .default(30)
    .description("Minutes after which access tokens will be expired"),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
    .default(30)
    .description("Days after which refresh tokens will be expired"),
  SMTP_HOST: Joi.string().description("Default email server"),
  SMTP_PORT: Joi.number().description("Port to connect to the email server"),
  SMTP_USERNAME: Joi.string().description("Username for the email server"),
  SMTP_PASSWORD: Joi.string().description("Password for the email server"),
});
