const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    username: Joi.string().min(2),
    phoneNumber: Joi.string().min(9).max(13),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const validateAcct = {
  body: Joi.object().keys({
    digits: Joi.string().required(),
  }),
};

const email = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = { register, login, validateAcct, email, refreshTokens };
