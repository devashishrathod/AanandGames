const { asyncWrapper, sendSuccess } = require("../../utils");
const { getVenue } = require("../../services/venues");

exports.get = asyncWrapper(async (req, res) => {
  const venue = await getVenue(req.params?.id);
  return sendSuccess(res, 200, "Venue fetched", venue);
});
