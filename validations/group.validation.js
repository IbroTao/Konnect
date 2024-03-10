const Joi = require("joi");

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

const addOrRemoveMembers = {
  body: Joi.object().keys({
    members: Joi.array().required(),
  }),
};
