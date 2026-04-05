const mongoose = require("mongoose");
const { DEFAULT_IMAGES } = require("../constants");

const venueSchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, default: DEFAULT_IMAGES.VENUE },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Venue", venueSchema);
