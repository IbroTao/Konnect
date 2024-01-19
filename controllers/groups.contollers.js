const { Groups } = require("../models/groups.models");
const { User } = require("../models/user.models");

const createGroup = async (req, res) => {
  let group = new Groups({
    name: req.body.name,
    desc: req.body.desc,
    admin: req.params.id,
  });

  try {
    group = await group.save();
  } catch (err) {
    res.status(500).json(err);
  }
};

const editGroup = async (req, res) => {
  try {
    const group = await Groups.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { createGroup, editGroup };
