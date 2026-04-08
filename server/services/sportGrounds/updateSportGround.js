const SportGround = require("../../models/SportGround");
const Venue = require("../../models/Venue");
const Sport = require("../../models/Sport");
const Category = require("../../models/Category");
const {
  throwError,
  validateObjectId,
  parseDateTimeToSportFields,
  parseTimeToDate,
  formatTimeForUi,
  formatDateTimeForUi,
} = require("../../utils");
const { uploadImage, deleteImage } = require("../uploads");

exports.updateSportGround = async (id, payload = 0, image) => {
  validateObjectId(id, "SportGround Id");
  const sportGround = await SportGround.findById(id);
  if (!sportGround || sportGround.isDeleted) {
    throwError(404, "Sport ground not found");
  }

  if (payload) {
    let {
      venueId,
      sportId,
      categoryId,
      name,
      description,
      coach,
      openingTime,
      closingTime,
      level,
      sportDurationInHours,
      sportDate,
      sportTiming,
      maxPlayers,
      minPlayers,
      maxTeams,
      minTeams,
      features,
      isPrivate,
      isAvailable,
      isFull,
      isActive,
    } = payload;

    if (venueId) {
      validateObjectId(venueId, "Venue Id");
      const venue = await Venue.findById(venueId);
      if (!venue || venue.isDeleted) throwError(404, "Venue not found!");
      sportGround.venueId = venueId;
    }

    if (sportId) {
      validateObjectId(sportId, "Sport Id");
      const sport = await Sport.findById(sportId);
      if (!sport || sport.isDeleted) throwError(404, "Sport not found!");
      sportGround.sportId = sportId;
    }

    if (categoryId) {
      validateObjectId(categoryId, "Category Id");
      const category = await Category.findById(categoryId);
      if (!category || category.isDeleted)
        throwError(404, "Category not found!");
      sportGround.categoryId = categoryId;
    }

    if (name) {
      name = name.toLowerCase();
      const existing = await SportGround.findOne({
        _id: { $ne: id },
        venueId: sportGround.venueId,
        name,
        isDeleted: false,
      });
      if (existing) {
        throwError(
          400,
          "Another sport ground exists with this name for same venue",
        );
      }
      sportGround.name = name;
    }

    if (typeof isActive !== "undefined") {
      sportGround.isActive = !sportGround.isActive;
    }

    if (typeof isAvailable !== "undefined") {
      sportGround.isAvailable = !sportGround.isAvailable;
    }

    if (typeof isPrivate !== "undefined") {
      sportGround.isPrivate = !sportGround.isPrivate;
    }

    if (typeof isFull !== "undefined") {
      sportGround.isFull = !sportGround.isFull;
    }

    if (description) sportGround.description = description?.toLowerCase() || "";
    if (coach) sportGround.coach = coach?.toLowerCase() || "";
    if (openingTime) sportGround.openingTime = openingTime;
    if (closingTime) sportGround.closingTime = closingTime;
    if (level) sportGround.level = level;

    if (typeof sportDurationInHours !== "undefined") {
      sportGround.sportDurationInHours = sportDurationInHours;
    }

    if (typeof maxPlayers !== "undefined") sportGround.maxPlayers = maxPlayers;
    if (typeof minPlayers !== "undefined") sportGround.minPlayers = minPlayers;
    if (typeof maxTeams !== "undefined") sportGround.maxTeams = maxTeams;
    if (typeof minTeams !== "undefined") sportGround.minTeams = minTeams;

    if (features) sportGround.features = features;

    // Date/time handling:
    // - sportDate now expects combined datetime string (e.g. 2026-04-08 05:00 AM)
    // - sportTiming can override time-of-day if provided
    if (sportDate) {
      const parsed = parseDateTimeToSportFields(String(sportDate), "sportDate");
      sportGround.sportDate = parsed.sportDate;
      sportGround.sportTiming = parsed.sportTiming;
    }

    if (sportTiming) {
      const anchor = sportGround.sportDate || new Date();
      sportGround.sportTiming = parseTimeToDate(
        String(sportTiming),
        anchor,
        "sportTiming",
      );
    }
  }

  if (image) {
    if (sportGround.image) await deleteImage(sportGround.image);
    const imageUrl = await uploadImage(image.tempFilePath);
    sportGround.image = imageUrl;
  }

  sportGround.updatedAt = new Date();
  await sportGround.save();

  const obj = sportGround.toObject();
  obj.sportTimingDisplay = formatTimeForUi(obj.sportTiming);
  obj.sportDateDisplay = formatDateTimeForUi(obj.sportDate);
  return obj;
};
