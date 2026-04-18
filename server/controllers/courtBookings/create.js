const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createCourtBooking } = require("../../services/courtBookings");
const { validateCreateCourtBooking } = require("../../validator/courtBookings");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateCourtBooking(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const booking = await createCourtBooking(req.userId, value);
  return sendSuccess(res, 201, "Court booking created", booking);
});
