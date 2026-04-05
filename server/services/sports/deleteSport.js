const Sport = require("../../models/Sports");
const { throwError, validateObjectId } = require("../../utils");
const { deleteImage } = require("../uploads");

exports.deleteSport = async (id) => {
  validateObjectId(id, "Sport Id");
  const sport = await Sport.findById(id);
  if (!sport || sport.isDeleted) throwError(404, "Sport not found");
  await deleteImage(sport?.image);
  sport.isDeleted = true;
  sport.isActive = false;
  sport.image = null;
  sport.updatedAt = new Date();
  await sport.save();
  return;
};
