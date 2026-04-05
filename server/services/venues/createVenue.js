const Venue = require("../../models/Venue");
const Location = require("../../models/Location");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage } = require("../uploads");

exports.createVenue = async (payload, image) => {
  let { locationId, name, description, isActive } = payload;
  validateObjectId(locationId, "Location Id");
  const location = await Location.findById(locationId);
  if (!location || location.isDeleted) throwError(404, "Location not found!");

  name = name?.toLowerCase();
  description = description?.toLowerCase();

  const existingVenue = await Venue.findOne({
    locationId,
    name,
    isDeleted: false,
  });
  if (existingVenue) {
    throwError(400, `Venue already exist with this name for ${location.name}`);
  }

  let imageUrl;
  if (image) imageUrl = await uploadImage(image.tempFilePath);

  return await Venue.create({
    locationId,
    name,
    description,
    image: imageUrl,
    isActive,
  });
};
