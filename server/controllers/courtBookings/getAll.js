const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllCourtBookings } = require("../../services/courtBookings");
const { validateGetAllCourtBookingsQuery } = require("../../validator/courtBookings");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllCourtBookingsQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));

  const result = await getAllCourtBookings(value, req.userId);
  return sendSuccess(res, 200, "Court bookings fetched", result);
});
