const mongoose = require("mongoose");

const courtSlotSchema = new mongoose.Schema(
  {
    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
      index: true,
    },
    groundId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ground",
      required: true,
      index: true,
    },
    sportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
      index: true,
    },
    slotStart: { type: Date, required: true, index: true },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourtBooking",
      default: null,
      index: true,
    },
    isReserved: { type: Boolean, default: true, index: true },
    reservedUntil: { type: Date, default: null, index: true },
  },
  { timestamps: true, versionKey: false },
);

courtSlotSchema.index(
  { courtId: 1, slotStart: 1 },
  { unique: true, partialFilterExpression: { isReserved: true } },
);

module.exports = mongoose.model("CourtSlot", courtSlotSchema);
