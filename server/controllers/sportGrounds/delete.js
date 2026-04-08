const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteSportGround } = require("../../services/sportGrounds");

exports.deleteSportGround = asyncWrapper(async (req, res) => {
  await deleteSportGround(req.params?.id);
  return sendSuccess(res, 200, "Sport ground deleted successfully");
});
