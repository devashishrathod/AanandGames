const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteSport } = require("../../services/sports");

exports.deleteSport = asyncWrapper(async (req, res) => {
  await deleteSport(req.params?.id);
  return sendSuccess(res, 200, "Sport deleted successfully");
});
