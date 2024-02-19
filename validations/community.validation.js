const Joi = require("joi");
const { content } = require("pdfkit/js/page");

const createCommunity = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(40).required(),
    info: Joi.string().min(2).max(400).required(),
    type: Joi.string().required(),
    rules: Jo.string().required(),
  }),
};

const joinOrLeaveCommunity = {
  body: Joi.object().keys({
    member: Joi.string().required(),
  }),
};

const addOrRemoveAdmin = {
  body: Joi.object().keys({
    admin: Joi.string().required(),
  }),
};

const createPost = {
  body: Joi.object().keys({
    content: Joi.string().required(),
    communityId: Joi.string().required(),
  }),
};

const updateInfo = {
  body: Joi.object().keys({
    info: Joi.string().required(),
  }),
};

const updateRulesAndType = {
  body: Joi.object().keys({
    rules: Joi.string(),
    type: Joi.string(),
  }),
};

const sharePost = {
  body: Joi.object().keys({
    content: Joi.string(),
  }),
  params: Joi.object().keys({}),
};

module.exports = {
  joinOrLeaveCommunity,
  addOrRemoveAdmin,
  createPost,
  createCommunity,
  updateInfo,
};
