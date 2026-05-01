const SportGround = require("../../models/SportGround");
const Academy = require("../../models/Academy");
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
const { uploadImage } = require("../uploads");

exports.createSportGround = async (payload, image) => {
  let {
    academyId,
    venueId,
    sportId,
    categoryId,
    name,
    description,
    price,
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

  validateObjectId(venueId, "Venue Id");
  validateObjectId(sportId, "Sport Id");
  validateObjectId(categoryId, "Category Id");
  validateObjectId(academyId, "Academy Id");

  const academy = await Academy.findById(academyId);
  if (!academy || academy.isDeleted) throwError(404, "Academy not found!");

  const venue = await Venue.findById(venueId);
  if (!venue || venue.isDeleted) throwError(404, "Venue not found!");

  const sport = await Sport.findById(sportId);
  if (!sport || sport.isDeleted) throwError(404, "Sport not found!");

  const category = await Category.findById(categoryId);
  if (!category || category.isDeleted) throwError(404, "Category not found!");

  name = name?.toLowerCase();
  description = description?.toLowerCase();
  coach = coach?.toLowerCase();

  // const existing = await SportGround.findOne({
  //   venueId,
  //   name,
  //   isDeleted: false,
  // });
  // if (existing) {
  //   throwError(
  //     400,
  //     `Sport ground already exist with this name for ${venue.name}`,
  //   );
  // }

  const parsed = parseDateTimeToSportFields(String(sportDate), "sportDate");
  const parsedSportDate = parsed.sportDate;
  let parsedSportTiming = parsed.sportTiming;
  if (sportTiming) {
    parsedSportTiming = parseTimeToDate(
      String(sportTiming),
      parsedSportDate,
      "sportTiming",
    );
  }

  let imageUrl;
  if (image) imageUrl = await uploadImage(image.tempFilePath);

  const created = await SportGround.create({
    venueId,
    academyId,
    sportId,
    categoryId,
    name,
    description,
    price,
    coach,
    openingTime,
    closingTime,
    level,
    sportDurationInHours,
    sportDate: parsedSportDate,
    sportTiming: parsedSportTiming,
    maxPlayers,
    minPlayers,
    maxTeams,
    minTeams,
    features,
    isPrivate,
    isAvailable,
    isFull,
    image: imageUrl,
    isActive,
  });
  const obj = created.toObject();
  obj.sportTimingDisplay = formatTimeForUi(obj.sportTiming);
  obj.sportDateDisplay = formatDateTimeForUi(obj.sportDate);
  return obj;
};
