const Sport = require("../../models/Sport");
const { throwError } = require("../../utils");
const { uploadImage } = require("../uploads");

exports.createSport = async (payload, image) => {
  let { name, description, isActive } = payload;
  name = name?.toLowerCase();
  description = description?.toLowerCase();
  const existingSport = await Sport.findOne({ name, isDeleted: false });
  if (existingSport) {
    throwError(400, "Sport already exist with this name");
  }
  let imageUrl;
  if (image) imageUrl = await uploadImage(image.tempFilePath);
  return await Sport.create({
    name,
    description,
    image: imageUrl,
    isActive,
  });
};
