const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createGroup = {
  body: Joi.object().keys({
    name: Joi.string().min(3).max(40).required(),
    members: Joi.array(),
  }),
};

const sendMessage = {
  body: Joi.object().keys({
    groupId: Joi.string().required(),
    text: Joi.string(),
  }),
};

module.exports = {
  createGroup,
  sendMessage,
};
