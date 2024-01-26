const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { tokenTypes } = require("../configs/tokenTypes");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { uniqueFiveDigits } = require("../utils/generateFiveDigits");
