const mongoose = require("mongoose");
const Ground = require("../../models/Ground");
const Court = require("../../models/Court");
const Sport = require("../../models/Sport");
const CourtSlot = require("../../models/CourtSlot");
const {
  throwError,
  validateObjectId,
  parseIsoDateOnly,
  parseTimeToDate,
  formatTimeForUi,
} = require("../../utils");

const ceilToNextHour = (d) => {
  const x = new Date(d);
  x.setMinutes(0, 0, 0);
  if (x.getTime() < d.getTime()) x.setHours(x.getHours() + 1);
  return x;
};

const getSlotConfig = async (sportId) => {
  validateObjectId(sportId, "Sport Id");
  const sport = await Sport.findById(sportId);
  if (!sport || sport.isDeleted) throwError(404, "Sport not found");

  const isCricket =
    String(sport.name || "")
      .trim()
      .toLowerCase() === "cricket";
  if (isCricket) {
    return { durationMs: Math.round(3.5 * 60 * 60 * 1000), requiredHours: 4 };
  }
  return { durationMs: 60 * 60 * 1000, requiredHours: 1 };
};

exports.getAllTimeSlots = async ({ groundId, sportId, date }) => {
  validateObjectId(groundId, "Ground Id");
  validateObjectId(sportId, "Sport Id");

  const ground = await Ground.findById(groundId);
  if (!ground || ground.isDeleted) throwError(404, "Ground not found");

  const groundSports = Array.isArray(ground.sports)
    ? ground.sports.map(String)
    : [];
  if (!groundSports.includes(String(sportId))) {
    throwError(400, "This sport is not linked to this ground");
  }

  const anchorDate = parseIsoDateOnly(date, "date");
  const opening = parseTimeToDate(
    ground.openingTime,
    anchorDate,
    "openingTime",
  );
  const closing = parseTimeToDate(
    ground.closingTime,
    anchorDate,
    "closingTime",
  );
  if (closing.getTime() <= opening.getTime()) {
    throwError(422, "Invalid ground opening/closing time");
  }

  const { durationMs, requiredHours } = await getSlotConfig(sportId);

  const courts = await Court.find({
    groundId,
    sportId,
    isDeleted: false,
    isActive: true,
    status: { $ne: "maintenance" },
  }).select("_id");

  const totalCourts = courts.length;

  const now = new Date();
  let startCursor = new Date(opening);
  if (
    anchorDate.getFullYear() === now.getFullYear() &&
    anchorDate.getMonth() === now.getMonth() &&
    anchorDate.getDate() === now.getDate()
  ) {
    const minStart = ceilToNextHour(now);
    if (minStart.getTime() > startCursor.getTime()) startCursor = minStart;
  }

  const lastStart = new Date(closing.getTime() - durationMs);
  if (startCursor.getTime() > lastStart.getTime()) {
    return {
      groundId,
      sportId,
      date,
      totalCourts,
      slots: [],
    };
  }

  const slots = [];
  const startTimes = [];
  for (
    let t = new Date(startCursor);
    t.getTime() <= lastStart.getTime();
    t = new Date(t.getTime() + 60 * 60 * 1000)
  ) {
    startTimes.push(new Date(t));
  }

  const courtIds = courts.map((c) => String(c._id));
  const reservedByCourt = new Map();
  if (totalCourts > 0 && startTimes.length) {
    const minSlotStart = startTimes[0];
    const maxSlotStart = new Date(
      startTimes[startTimes.length - 1].getTime() +
        (requiredHours - 1) * 60 * 60 * 1000,
    );

    const reserved = await CourtSlot.find({
      groundId: new mongoose.Types.ObjectId(groundId),
      sportId: new mongoose.Types.ObjectId(sportId),
      isReserved: true,
      slotStart: { $gte: minSlotStart, $lte: maxSlotStart },
    })
      .select("courtId slotStart")
      .lean();

    for (const r of reserved) {
      const key = String(r.courtId);
      if (!reservedByCourt.has(key)) reservedByCourt.set(key, new Set());
      reservedByCourt.get(key).add(new Date(r.slotStart).getTime());
    }
  }

  for (const startTime of startTimes) {
    const startMs = startTime.getTime();
    let bookedCourts = 0;

    if (totalCourts > 0) {
      for (const cId of courtIds) {
        const set = reservedByCourt.get(String(cId));
        if (!set) continue;

        let ok = true;
        for (let i = 0; i < requiredHours; i++) {
          const tMs = startMs + i * 60 * 60 * 1000;
          if (!set.has(tMs)) {
            ok = false;
            break;
          }
        }
        if (ok) bookedCourts++;
      }
    }

    const endTime = new Date(startMs + durationMs);
    slots.push({
      startTime,
      endTime,
      label: formatTimeForUi(startTime),
      bookedCourts,
      totalCourts,
      isFullyBooked: totalCourts > 0 ? bookedCourts >= totalCourts : false,
    });
  }

  return {
    groundId,
    sportId,
    date,
    totalCourts,
    slots,
  };
};
