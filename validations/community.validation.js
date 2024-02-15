const Joi = require("joi");

const createCommunity = {
  body: Joi.object().keys({
    name: Joi.string(),
  }),
};
