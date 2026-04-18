const CourtBooking = require("../../models/CourtBooking");
const User = require("../../models/User");
const { throwError, validateObjectId } = require("../../utils");
const { ROLES } = require("../../constants");

exports.getCourtBooking = async (tokenUserId, id) => {
  const user = await User.findById(tokenUserId);
  if (!user) throwError(404, "User not found");

  validateObjectId(id, "Booking Id");
  const booking = await CourtBooking.findById(id)
    .populate({ path: "userId", select: "name email mobile role" })
    .populate({ path: "items.groundId" })
    .populate({ path: "items.courtId" })
    .populate({ path: "items.sportId", select: "name description image" });

  if (!booking) throwError(404, "Booking not found");

  if (user.role !== ROLES.ADMIN) {
    if (String(booking.userId?._id || booking.userId) !== String(user._id)) {
      throwError(403, "Forbidden");
    }
  }

  return booking;
};
