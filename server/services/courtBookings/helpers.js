const Sport = require("../../models/Sport");
const Ground = require("../../models/Ground");
const { throwError, validateObjectId, parseTimeToDate } = require("../../utils");

const getSlotConfig = async (sportId) => {
  validateObjectId(sportId, "Sport Id");
  const sport = await Sport.findById(sportId);
  if (!sport || sport.isDeleted) throwError(404, "Sport not found");

  const isCricket = String(sport.name || "").trim().toLowerCase() === "cricket";
  if (isCricket) {
    return { durationMs: Math.round(3.5 * 60 * 60 * 1000), requiredHours: 4, durationHours: 3.5 };
  }
  return { durationMs: 60 * 60 * 1000, requiredHours: 1, durationHours: 1 };
};

const assertSlotWithinGroundHours = (ground, startTime, durationMs) => {
  const start = new Date(startTime);
  if (isNaN(start.getTime())) throwError(422, "Invalid startTime");

  const opening = parseTimeToDate(ground.openingTime, start, "openingTime");
  const closing = parseTimeToDate(ground.closingTime, start, "closingTime");
  if (closing.getTime() <= opening.getTime()) {
    throwError(422, "Invalid ground opening/closing time");
  }

  const end = new Date(start.getTime() + durationMs);
  if (start.getTime() < opening.getTime() || end.getTime() > closing.getTime()) {
    throwError(400, "Slot is outside ground working hours");
  }

  const now = new Date();
  if (start.getTime() < now.getTime()) {
    throwError(400, "Past time slots are not allowed");
  }

  return { start, end };
};

const assertSportLinkedToGround = (ground, sportId) => {
  const groundSports = Array.isArray(ground.sports) ? ground.sports.map(String) : [];
  if (!groundSports.includes(String(sportId))) {
    throwError(400, "This sport is not linked to this ground");
  }
};

const getGroundOrThrow = async (groundId) => {
  validateObjectId(groundId, "Ground Id");
  const ground = await Ground.findById(groundId);
  if (!ground || ground.isDeleted) throwError(404, "Ground not found");
  return ground;
};

module.exports = {
  getSlotConfig,
  assertSlotWithinGroundHours,
  assertSportLinkedToGround,
  getGroundOrThrow,
};
