const Sport = require("../../models/Sport");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage, deleteImage } = require("../uploads");

exports.updateSport = async (id, payload = 0, image) => {
  validateObjectId(id, "Sport Id");
  const sport = await Sport.findById(id);
  if (!sport || sport.isDeleted) throwError(404, "Sport not found");
  if (payload) {
    let { name, description, isActive } = payload;
    if (typeof isActive !== "undefined") sport.isActive = !sport.isActive;
    if (name) {
      name = name.toLowerCase();
      const existing = await Sport.findOne({
        _id: { $ne: id },
        name,
        isDeleted: false,
      });
      if (existing) throwError(400, "Another sport exists with this name");
      sport.name = name;
    }
    if (description) sport.description = description?.toLowerCase() || "";
  }
  if (image) {
    if (sport.image) await deleteImage(sport.image);
    const imageUrl = await uploadImage(image.tempFilePath);
    sport.image = imageUrl;
  }
  sport.updatedAt = new Date();
  await sport.save();
  return sport;
};
