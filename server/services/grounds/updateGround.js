const Ground = require("../../models/Ground");
const Venue = require("../../models/Venue");
const Sport = require("../../models/Sport");
const Banner = require("../../models/Banner");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage } = require("../uploads");

const normalizeFilesToArray = (maybeFiles) => {
  if (!maybeFiles) return [];
  if (Array.isArray(maybeFiles)) return maybeFiles;
  return [maybeFiles];
};

exports.updateGround = async (id, payload = 0, bannersFiles) => {
  validateObjectId(id, "Ground Id");
  const ground = await Ground.findById(id);
  if (!ground || ground.isDeleted) throwError(404, "Ground not found");

  if (payload) {
    let {
      name,
      description,
      venueId,
      sportId,
      type,
      openingTime,
      closingTime,
      pricePerHour,
      status,
      isActive,
    } = payload;

    if (venueId) {
      validateObjectId(venueId, "Venue Id");
      const venue = await Venue.findById(venueId);
      if (!venue || venue.isDeleted) throwError(404, "Venue not found!");
      ground.venueId = venueId;
    }

    if (sportId) {
      validateObjectId(sportId, "Sport Id");
      const sport = await Sport.findById(sportId);
      if (!sport || sport.isDeleted) throwError(404, "Sport not found!");
      ground.sportId = sportId;
    }

    if (name) {
      name = name.toLowerCase();
      const existing = await Ground.findOne({
        _id: { $ne: id },
        venueId: ground.venueId,
        sportId: ground.sportId,
        name,
        isDeleted: false,
      });
      if (existing) throwError(400, "Another ground exists with this name");
      ground.name = name;
    }

    if (typeof isActive !== "undefined") {
      ground.isActive = !ground.isActive;
    }

    if (description) ground.description = description?.toLowerCase() || "";
    if (type) ground.type = type?.toLowerCase();
    if (openingTime) ground.openingTime = openingTime;
    if (closingTime) ground.closingTime = closingTime;
    if (typeof pricePerHour !== "undefined") ground.pricePerHour = pricePerHour;
    if (status) ground.status = status;
  }

  const bannersArray = normalizeFilesToArray(bannersFiles);
  if (bannersArray.length) {
    for (let i = 0; i < bannersArray.length; i++) {
      const file = bannersArray[i];
      const imageUrl = await uploadImage(file.tempFilePath);
      const banner = await Banner.create({
        name: `${ground.name}-banner-${Date.now()}-${i}`,
        description: "",
        groundId: ground._id,
        image: imageUrl,
        isActive: true,
      });
      ground.banners.push(banner._id);
    }
  }

  ground.updatedAt = new Date();
  await ground.save();

  return await Ground.findById(id)
    .populate({ path: "venueId", select: "name description image" })
    .populate({ path: "sportId", select: "name description image" })
    .populate({
      path: "banners",
      select: "name description image video isActive",
    });
};
