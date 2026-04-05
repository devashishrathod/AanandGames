const { asyncWrapper, sendSuccess } = require("../../utils");
const { getSport } = require("../../services/sports");

exports.get = asyncWrapper(async (req, res) => {
  const sport = await getSport(req.params?.id);
  return sendSuccess(res, 200, "Sport fetched", sport);
});
