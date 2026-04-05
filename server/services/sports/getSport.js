const Sport = require("../../models/Sports");
const { throwError, validateObjectId } = require("../../utils");

exports.getSport = async (id) => {
  validateObjectId(id, "Sport Id");
  const sport = await Sport.findById(id).select("-isDeleted");
  if (!sport || sport.isDeleted) throwError(404, "Sport not found");
  return sport;
};
