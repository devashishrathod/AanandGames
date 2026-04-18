const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateCourtBooking } = require("../../services/courtBookings");
const { validateUpdateCourtBooking } = require("../../validator/courtBookings");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateCourtBooking(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const updated = await updateCourtBooking(req.params?.id, value, req.userId);
  return sendSuccess(res, 200, "Court booking updated", updated);
});
