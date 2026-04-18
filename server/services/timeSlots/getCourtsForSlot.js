const mongoose = require("mongoose");
const Ground = require("../../models/Ground");
const Court = require("../../models/Court");
const Sport = require("../../models/Sport");
const CourtSlot = require("../../models/CourtSlot");
const {
  throwError,
  validateObjectId,
  parseTimeToDate,
  formatTimeForUi,
} = require("../../utils");

const getSlotConfig = async (sportId) => {
  validateObjectId(sportId, "Sport Id");
  const sport = await Sport.findById(sportId);
  if (!sport || sport.isDeleted) throwError(404, "Sport not found");

  const isCricket = String(sport.name || "").trim().toLowerCase() === "cricket";
  if (isCricket) {
    return { durationMs: Math.round(3.5 * 60 * 60 * 1000), requiredHours: 4 };
  }
  return { durationMs: 60 * 60 * 1000, requiredHours: 1 };
};

exports.getCourtsForSlot = async ({ groundId, sportId, startTime }) => {
  validateObjectId(groundId, "Ground Id");
  validateObjectId(sportId, "Sport Id");

  const ground = await Ground.findById(groundId);
  if (!ground || ground.isDeleted) throwError(404, "Ground not found");

  const groundSports = Array.isArray(ground.sports) ? ground.sports.map(String) : [];
  if (!groundSports.includes(String(sportId))) {
    throwError(400, "This sport is not linked to this ground");
  }

  const start = new Date(startTime);
  if (isNaN(start.getTime())) throwError(422, "Invalid startTime");

  // Ensure slot start is within opening hours for that date
  const opening = parseTimeToDate(ground.openingTime, start, "openingTime");
  const closing = parseTimeToDate(ground.closingTime, start, "closingTime");
  if (start.getTime() < opening.getTime() || start.getTime() >= closing.getTime()) {
    throwError(400, "startTime is outside ground working hours");
  }

  const now = new Date();
  if (start.getTime() < now.getTime()) throwError(400, "Past time slots are not allowed");

  const { durationMs, requiredHours } = await getSlotConfig(sportId);

  const hourStarts = [];
  for (let i = 0; i < requiredHours; i++) {
    hourStarts.push(new Date(start.getTime() + i * 60 * 60 * 1000));
  }

  const courts = await Court.find({
    groundId,
    sportId,
    isDeleted: false,
    isActive: true,
    status: { $ne: "maintenance" },
  }).select("name pricePerHour status");

  const reservedAgg = await CourtSlot.aggregate([
    {
      $match: {
        groundId: new mongoose.Types.ObjectId(groundId),
        sportId: new mongoose.Types.ObjectId(sportId),
        slotStart: { $in: hourStarts },
        isReserved: true,
      },
    },
    { $group: { _id: "$courtId", c: { $sum: 1 } } },
    { $match: { c: requiredHours } },
  ]);

  const reservedCourtIds = new Set(reservedAgg.map((x) => String(x._id)));

  const endTime = new Date(start.getTime() + durationMs);

  return {
    groundId,
    sportId,
    startTime: start,
    endTime,
    label: formatTimeForUi(start),
    courts: courts.map((c) => ({
      _id: c._id,
      name: c.name,
      pricePerHour: c.pricePerHour,
      status: c.status,
      isBooked: reservedCourtIds.has(String(c._id)),
    })),
  };
};
