const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createGroup = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    category: Joi.array().required(),
    mature: Joi.boolean(),
    description: Joi.string(),
    type: Joi.string(),
    language: Joi.string(),
    tags: Joi.string(),
    isUploaded: Joi.boolean(),
  }),
};

module.exports = {
  createGroup,
};
