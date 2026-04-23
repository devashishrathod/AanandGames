const CourtBooking = require("../../models/CourtBooking");
const User = require("../../models/User");
const { throwError, validateObjectId } = require("../../utils");
const { ROLES } = require("../../constants");

exports.updateCourtBooking = async (id, payload = 0, tokenUserId) => {
  const user = await User.findById(tokenUserId);
  if (!user) throwError(404, "User not found");

  validateObjectId(id, "Booking Id");
  const booking = await CourtBooking.findById(id);
  if (!booking) throwError(404, "Booking not found");

 // const isAdmin = user.role === ROLES.ADMIN;
//  if (!isAdmin) {
 //   if (String(booking.userId) !== String(user._id)) throwError(403, "Forbidden");
 // }

  if (payload) {
    const { status, paymentStatus, paymentId } = payload;

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (typeof paymentId !== "undefined") booking.paymentId = paymentId;
  }

  booking.updatedAt = new Date();
  await booking.save();

  return await CourtBooking.findById(id)
    .populate({ path: "userId", select: "name email mobile role" })
    .populate({ path: "items.groundId" })
    .populate({ path: "items.courtId" })
    .populate({ path: "items.sportId", select: "name description image" });
};
