const Joi = require("joi");
const { objectId } = require("./custom.validation");
const { query } = require("express");

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

const getPosts = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createComment = {
  body: Joi.object().keys({
    bookId: Joi.string().required(),
    parentId: Joi.string(),
    content: Joi.string().required(),
  }),
};

module.exports = {
  createGroup,
  getPosts,
  createComment,
};
