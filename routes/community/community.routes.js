const express = require("express");
const validate = require("../../middlewares/validate");
const { communityValidation } = require("../../validations");
const { singleUpload, multipleUpload } = require("../../libs/multer");
const validateAccount = require("../../middlewares/validateUser");
const { communityController } = require("../../controllers");

const router = express.Router();

router.post(
  "/new",
  validateAccount,
  validate(communityValidation),
  communityController.createCommunity
);

router.get("/", communityController.queryCommunities);
router.get("/:id", communityController.getCommunityById);
router.get("/:name", communityController.getCommunityByName);
router.get("/:id/members", validateAccount, communityController.getMembers);
router.get("/:id/requests", validateAccount, communityController.getRequests);
router.put(
  "/:id/add-member",
  validateAccount,
  validate(communityValidation.joinOrLeaveCommunity),
  communityController.addMember
);
router.put(
  "/:id/remove-member",
  validateAccount,
  validate(communityValidation.joinOrLeaveCommunity),
  communityController.removeMember
);
