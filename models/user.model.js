const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const modelNames = require("../constants/modelNames");
const mongoosePaginate = require("mongoose-paginate-v2");
const toJSON = require("./plugins/toJSON.plugin");
const adminPermissions = require("../configs/adminPermissions");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(true)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      validate(value) {
        if (value !== "none") {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error(
              "Password must contain at least one letter and one letter"
            );
          }
        }
      },
      private: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    permissions: {
      type: [String],
      enum: adminPermissions,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    avatar: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    bio: {
      type: String,
      minlength: 50,
      maxlength: 250,
    },
    dob: {
      type: Date,
    },
    location: {
      type: String,
    },
    gender: {
      type: String,
      minlength: 1,
      enum: ["male", "female"],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      minlength: 2,
      unique: true,
    },
    totalFollowers: {
      type: Number,
      default: 0,
    },
    showMatureContent: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      enum: ["basic", "premium"],
      default: "basic",
    },
    allowDirectMessaging: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  {
    timestamps: true,
  }
);

// add plugins to convert mongoose into json
userSchema.plugin(mongoosePaginate);
userSchema.plugin(toJSON);

/**
 * Check if email is taken
 * @
 */
