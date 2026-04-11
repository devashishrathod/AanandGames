const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteGround } = require("../../services/grounds");

exports.deleteGround = asyncWrapper(async (req, res) => {
  await deleteGround(req.params?.id);
  return sendSuccess(res, 200, "Ground deleted");
});
