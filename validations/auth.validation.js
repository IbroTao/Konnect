const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required().custom(password),
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

module.exports = { register };
