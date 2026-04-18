const { asyncWrapper, sendSuccess } = require("../../utils");
const { cancelCourtBooking } = require("../../services/courtBookings");

exports.cancel = asyncWrapper(async (req, res) => {
  await cancelCourtBooking(req.params?.id, req.userId);
  return sendSuccess(res, 200, "Court booking cancelled successfully");
});
