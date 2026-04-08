const { throwError } = require("./CustomError");

const formatTimeForUi = (dateObj) => {
  if (!dateObj) return null;
  const d = new Date(dateObj);
  if (isNaN(d.getTime())) return null;

  const hours = d.getHours();
  const minutes = d.getMinutes();

  const h12 = ((hours + 11) % 12) + 1;
  const ampm = hours >= 12 ? "PM" : "AM";

  if (minutes === 0) return `${h12} ${ampm}`;
  return `${h12}:${String(minutes).padStart(2, "0")} ${ampm}`;
};

const formatDateTimeForUi = (dateObj) => {
  if (!dateObj) return null;
  const d = new Date(dateObj);
  if (isNaN(d.getTime())) return null;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${formatTimeForUi(d)}`;
};

const parseIsoDateOnly = (isoDate, fieldName = "date") => {
  if (!isoDate || typeof isoDate !== "string") {
    throwError(422, `${fieldName} is required`);
  }

  const input = isoDate.trim();
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const y = Number(match[1]);
    const m = Number(match[2]);
    const d = Number(match[3]);
    const local = new Date(y, m - 1, d, 0, 0, 0, 0);
    if (isNaN(local.getTime())) throwError(422, `Invalid ${fieldName}`);
    return local;
  }

  const dt = new Date(input);
  if (isNaN(dt.getTime())) throwError(422, `Invalid ${fieldName}`);
  return dt;
};

const parseTimeToDate = (
  timeString,
  anchorDate = new Date(),
  fieldName = "time",
) => {
  if (!timeString || typeof timeString !== "string") {
    throwError(422, `${fieldName} is required`);
  }

  const input = timeString.trim().toUpperCase().replace(/\s+/g, " ");

  // Supports: 5AM, 5 AM, 5:30AM, 5:30 AM, 12 PM
  const match = input.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (!match) {
    throwError(422, `Invalid ${fieldName}`);
  }

  let hours = Number(match[1]);
  const minutes = typeof match[2] !== "undefined" ? Number(match[2]) : 0;
  const meridiem = match[3];

  if (hours < 1 || hours > 12) throwError(422, `Invalid ${fieldName}`);
  if (minutes < 0 || minutes > 59) throwError(422, `Invalid ${fieldName}`);

  if (meridiem === "AM") {
    if (hours === 12) hours = 0;
  } else {
    if (hours !== 12) hours += 12;
  }

  const base = new Date(anchorDate);
  if (isNaN(base.getTime())) {
    throwError(422, `Invalid ${fieldName} date anchor`);
  }

  base.setHours(hours, minutes, 0, 0);
  return base;
};

const parseTimeToMinutes = (timeString, fieldName = "time") => {
  const anchor = new Date(2000, 0, 1, 0, 0, 0, 0);
  const d = parseTimeToDate(timeString, anchor, fieldName);
  return d.getHours() * 60 + d.getMinutes();
};

const parseDateTimeToSportFields = (
  dateTimeString,
  fieldName = "sportDate",
) => {
  if (!dateTimeString || typeof dateTimeString !== "string") {
    throwError(422, `${fieldName} is required`);
  }

  const input = dateTimeString.trim().replace(/\s+/g, " ");

  // Supports: 2026-04-08 05:00 AM, 2026-04-08 5 AM
  const match = input.match(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i,
  );

  if (!match) {
    const d = new Date(input);
    if (isNaN(d.getTime())) throwError(422, `Invalid ${fieldName}`);
    return { sportDate: d, sportTiming: new Date(d) };
  }

  const datePart = match[1];
  const timePart = `${match[2]}${match[3] ? ":" + match[3] : ""} ${match[4]}`;

  const dateOnly = parseIsoDateOnly(datePart, fieldName);
  const sportDate = parseTimeToDate(timePart, dateOnly, fieldName);
  const sportTiming = new Date(sportDate);
  return { sportDate, sportTiming };
};

module.exports = {
  parseIsoDateOnly,
  parseTimeToDate,
  parseTimeToMinutes,
  parseDateTimeToSportFields,
  formatTimeForUi,
  formatDateTimeForUi,
};
