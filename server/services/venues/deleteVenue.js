const Venue = require("../../models/Venue");
const { throwError, validateObjectId } = require("../../utils");
const { deleteImage } = require("../uploads");

exports.deleteVenue = async (id) => {
  validateObjectId(id, "Venue Id");
  const venue = await Venue.findById(id);
  if (!venue || venue.isDeleted) throwError(404, "Venue not found");

  await deleteImage(venue?.image);
  venue.isDeleted = true;
  venue.isActive = false;
  venue.image = null;
  venue.updatedAt = new Date();
  await venue.save();
  return;
};
