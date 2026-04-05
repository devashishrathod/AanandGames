const Venue = require("../../models/Venue");
const Location = require("../../models/Location");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage, deleteImage } = require("../uploads");

exports.updateVenue = async (id, payload = 0, image) => {
  validateObjectId(id, "Venue Id");
  const venue = await Venue.findById(id);
  if (!venue || venue.isDeleted) throwError(404, "Venue not found");

  let location;

  if (payload) {
    let { locationId, name, description, isActive } = payload;

    if (locationId) {
      validateObjectId(locationId, "Location Id");
      location = await Location.findById(locationId);
      if (!location || location.isDeleted) {
        throwError(404, "Location not found!");
      }
      venue.locationId = locationId;
    }

    if (name) {
      name = name.toLowerCase();
      const existingVenueWithLocation = await Venue.findOne({
        _id: { $ne: id },
        name,
        locationId: venue?.locationId,
        isDeleted: false,
      });
      if (existingVenueWithLocation) {
        throwError(400, `Another venue exists with this name for same location`);
      }
      venue.name = name;
    }

    if (name && locationId) {
      const existingVenueWithLocation = await Venue.findOne({
        _id: { $ne: id },
        name,
        locationId,
        isDeleted: false,
      });
      if (existingVenueWithLocation) {
        throwError(
          400,
          `Another venue exists with this name for ${location?.name || "location"}`,
        );
      }
    }

    if (typeof isActive !== "undefined") {
      venue.isActive = !venue.isActive;
    }

    if (description) venue.description = description?.toLowerCase() || "";
  }

  if (image) {
    if (venue.image) await deleteImage(venue.image);
    const imageUrl = await uploadImage(image.tempFilePath);
    venue.image = imageUrl;
  }

  venue.updatedAt = new Date();
  await venue.save();
  return venue;
};
