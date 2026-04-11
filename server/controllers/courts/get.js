const { asyncWrapper, sendSuccess } = require("../../utils");
const { getCourt } = require("../../services/courts");

exports.get = asyncWrapper(async (req, res) => {
  const court = await getCourt(req.params?.id);
  return sendSuccess(res, 200, "Court fetched", court);
});
