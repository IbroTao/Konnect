const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const validateAccount = require("../../middlewares/validateUser");
const groupValidation = require("../../validations/group.validation");
