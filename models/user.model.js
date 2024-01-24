const mongoose = require("mongoose");

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
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      private: true,
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
      enum: ["male", "female"],
    },
    username: {
      type: String,
      minlength: 2,
      unique: [true, "username already used by another user"],
    },
    totalFollowers: {
      type: Number,
      default: 0,
    },
    totalFollowing: {
      type: Number,
      default: 0,
    },
    allowDirectMessaging: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      enum: ["basic", "preminum"],
      default: "prenium",
    },
    points: {
      type: Number,
      default: 0,
    },
    interests: [
      {
        type: String,
        enum: categories,
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["reader", "author", "both", "admin"],
      default: "both",
    },
    permissions: {
      type: [String],
      enum: adminPermissions,
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

/**
 * Check if the email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be exclude
 * @returns {Promise<boolean>}
 */

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

const Users = mongoose.model("users", userSchema);

module.exports = { Users };
