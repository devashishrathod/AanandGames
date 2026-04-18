const mongoose = require("mongoose");
const CourtBooking = require("../../models/CourtBooking");
const CourtSlot = require("../../models/CourtSlot");
const User = require("../../models/User");
const { throwError, validateObjectId } = require("../../utils");
const { ROLES } = require("../../constants");

exports.cancelCourtBooking = async (id, tokenUserId) => {
  const user = await User.findById(tokenUserId);
  if (!user) throwError(404, "User not found");

  validateObjectId(id, "Booking Id");

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const booking = await CourtBooking.findById(id).session(session);
    if (!booking) throwError(404, "Booking not found");

    if (user.role !== ROLES.ADMIN) {
      if (String(booking.userId) !== String(user._id)) {
        throwError(403, "Forbidden");
      }
    }

    if (booking.status === "cancelled") {
      await session.commitTransaction();
      return;
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.updatedAt = new Date();
    await booking.save({ session });

    await CourtSlot.deleteMany({ bookingId: booking._id }).session(session);

    await session.commitTransaction();
    return;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
};
