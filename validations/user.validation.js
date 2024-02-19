const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string().name(),
    })
    .min(1),
};

const updateProfile = {
  body: Joi.object().keys({
    username: Joi.string(),
    phoneNumber: Joi.string().trim(),
    gender: Joi.string(),
    dob: Joi.date(),
    location: Joi.string(),
    bio: Joi.string().min(50).max(250),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    reason: Joi.string().required(),
  }),
};

module.exports = {
  updateProfile,
  deleteUser,
  updateUser,
  getUser,
  getUsers,
};
