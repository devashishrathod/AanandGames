const { asyncWrapper, sendSuccess } = require("../../utils");
const { getCourtBooking } = require("../../services/courtBookings");

exports.get = asyncWrapper(async (req, res) => {
  const booking = await getCourtBooking(req.userId, req.params?.id);
  return sendSuccess(res, 200, "Court booking fetched", booking);
});
