const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "test", "development")
      .required(),
    PORT: Joi.number().default(3000),
    MONGO_URL: Joi.string().required().description("MongoDB URL"),
    JWT_SECRET: Joi.string().required().description("JWT Secret Key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("Minutes after which access tokens will be expired"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("Days after which refresh tokens will be expired"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10),
    SMTP_HOST: Joi.string().description("Default email server"),
    SMTP_PORT: Joi.number().description("Port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("Username for the email server"),
    SMTP_PASSWORD: Joi.string().description("Password for the email server"),
    EMAIL_SENDER: Joi.string().description(
      "The 'from' fields in the email sent by the email"
    ),
    CLOUDINARY_NAME: Joi.string().description("Name of cloudinary"),
    CLOUDINARY_API_SECRET: Joi.string().description("cloudinary api secret"),
    CLOUDINARY_SECRET_KEY: Joi.string().description("cloudinary secret key"),
    COOKIE_DURATION: Joi.string(),
    SESSION_SESSION: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      dbName: "konnect",
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_MINUTES,
  },
};
