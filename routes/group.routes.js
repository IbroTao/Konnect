const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const validateAccount = require("../middlewares/validateUser");
const { groupController } = require("../controllers");
const { singleUpload, multipleUpload } = require("../libs/multer");
const { groupValidation } = require("../validations");
const { adminPermitter, isAdmin } = require("../middlewares/roles");

const router = express.Router();

router.get("/recent-msgs", validateAccount, groupController);
router.post(
  "/new",
  validateAccount,
  singleUpload,
  validate(groupValidation.createGroup),
  groupController.createGroup
);
router.get("/:name", validateAccount, groupController.getGroupByName);
router.get("/:groupId", validateAccount, groupController.getGroupById);
router.patch(
  "/:groupId/update-logo",
  validateAccount,
  singleUpload,
  groupController.uploadLogo
);
router.delete("/:groupId", validateAccount, groupController.deleteGroup);
router.post(
  "/msg",
  validateAccount,
  multipleUpload,
  validate(groupValidation.sendMessage),
  groupController.sendMessage
);
router.patch(
  "/:groupId/msg/mark-seen",
  validateAccount,
  groupController.markMessagesSeen
);
router.delete("/msg/:msgId", validateAccount, groupController.deleteMessage);
router.put(
  "/:groupId/add-members",
  validateAccount,
  validate(groupValidation.addOrRemoveMembers),
  groupController.addMembers
);
router.purge(
  "/:groupId/remove-members",
  validateAccount,
  validate(groupValidation.addOrRemoveMembers),
  groupController.removeMembers
);
router.put(
  "/:groupId/add-admins",
  validateAccount,
  validate(groupValidation.addOrRemoveAdmins),
  groupController.addAdmins
);
router.purge(
  "/:groupId/remove-admins",
  validateAccount,
  validate(groupValidation.addOrRemoveAdmins),
  groupController.removeAdmins
);
router.get(
  "/:groupId/msgs",
  validateAccount,
  groupController.getMessagesByGroupId
);
router.post(
  "/report",
  validateAccount,
  validate(groupValidation.reportMessage),
  groupController.reportMessage
);
router.get(
  "/report/:reportId",
  validateAccount,
  isAdmin,
  adminPermitter(["read"]),
  groupController.getReportedMessageById
);
router.get(
  "/reports",
  validateAccount,
  isAdmin,
  adminPermitter(["read"]),
  groupController.getReportedMessages
);

module.exports = router;
