const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *  get:
 *    summary: Fetch user details
 *    description: Fetch user details
 *    tags:
 *      - Profile
 *    responses:
 *      '200':
 *        description: User profile fetched successfully
 *      '400':
 *         description: Unable to fetch user details
 */
router.get("/profile", (req, res) => {
  const data = {
    name: "Mark",
    number: "909",
  };
  res.status(200).json(data);
});

module.exports = router;
