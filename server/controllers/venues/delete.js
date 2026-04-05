const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteVenue } = require("../../services/venues");

exports.deleteVenue = asyncWrapper(async (req, res) => {
  await deleteVenue(req.params?.id);
  return sendSuccess(res, 200, "Venue deleted successfully");
});
