const Venue = require("../../models/Venue");
const { throwError, validateObjectId } = require("../../utils");

exports.getVenue = async (id) => {
  validateObjectId(id, "Venue Id");
  const venue = await Venue.findById(id).select("-isDeleted");
  if (!venue || venue.isDeleted) throwError(404, "Venue not found");
  return venue;
};
