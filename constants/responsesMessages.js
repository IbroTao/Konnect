const MESSAGES = {
  // AUTH
  PASSWORD_SET: "username and password successfully set",
  SEND_VERIFICATION_CODE: "verification code sent",
  USER_NOT_FOUND: "user not found",
  RESOURCE_MISSING: "resource not found",
  CANNOT_SET_PASSWORD: "cannot set user's username and password",
  EMAIL_VERIFIED: "email verified",
  EMAIL_TAKEN: "user with this email already exists",
  CODE_EXPIRED: "either code has expired or something went wrong",
  UPDATE_PASSWORD: "password updated successfully",
  PASSWORD_NO_MATCH: "password does not match",
  PROVIDE_IMAGE: "please provide a valid image type i.e. png, jpeg or jpg",
  PROVIDE_BODY: "provide request body",

  // NON_SPECIFIC
  UPDATED: "resource updated",
  CREATED: "resource created",
  DELETED: "resource deleted",
  DELETE_FAILED: "cannot delete resource",
  UPDATED_FAILED: "failed to update resource",
  SUCCESS: "successful request",
  FAILURE: "failed request",
  FOLLOWED: "successfully followed user",
  UNFOLLOWED: "successfully unfollowed user",
};

module.exports = { MESSAGES };
