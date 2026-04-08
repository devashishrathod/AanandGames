const SportGround = require("../../models/SportGround");
const { throwError, validateObjectId } = require("../../utils");
const { deleteImage } = require("../uploads");

exports.deleteSportGround = async (id) => {
  validateObjectId(id, "SportGround Id");
  const sportGround = await SportGround.findById(id);
  if (!sportGround || sportGround.isDeleted) {
    throwError(404, "Sport ground not found");
  }

  await deleteImage(sportGround?.image);
  sportGround.isDeleted = true;
  sportGround.isActive = false;
  sportGround.image = null;
  sportGround.updatedAt = new Date();
  await sportGround.save();
  return;
};
