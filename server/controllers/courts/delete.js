const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteCourt } = require("../../services/courts");

exports.deleteCourt = asyncWrapper(async (req, res) => {
  await deleteCourt(req.params?.id);
  return sendSuccess(res, 200, "Court deleted");
});
