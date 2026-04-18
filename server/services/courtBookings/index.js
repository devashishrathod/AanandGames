const { createCourtBooking } = require("./createCourtBooking");
const { getAllCourtBookings } = require("./getAllCourtBookings");
const { getCourtBooking } = require("./getCourtBooking");
const { updateCourtBooking } = require("./updateCourtBooking");
const { cancelCourtBooking } = require("./cancelCourtBooking");

module.exports = {
  createCourtBooking,
  getAllCourtBookings,
  getCourtBooking,
  updateCourtBooking,
  cancelCourtBooking,
};
