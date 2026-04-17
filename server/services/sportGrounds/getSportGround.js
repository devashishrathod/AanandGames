const SportGround = require("../../models/SportGround");
const {
  throwError,
  validateObjectId,
  formatTimeForUi,
  formatDateTimeForUi,
} = require("../../utils");

exports.getSportGround = async (id) => {
  validateObjectId(id, "SportGround Id");
  const sportGround = await SportGround.findById(id)
    .select("-isDeleted")
    .populate({ path: "academyId", select: "name description image" })
    .populate({ path: "venueId", select: "name description image" })
    .populate({ path: "sportId", select: "name description image" })
    .populate({ path: "categoryId", select: "name description image" });
  if (!sportGround || sportGround.isDeleted)
    throwError(404, "Sport ground not found");

  const obj = sportGround.toObject();
  obj.sportTimingDisplay = formatTimeForUi(obj.sportTiming);
  obj.sportDateDisplay = formatDateTimeForUi(obj.sportDate);
  return obj;
};
