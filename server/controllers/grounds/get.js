const { asyncWrapper, sendSuccess } = require("../../utils");
const { getGround } = require("../../services/grounds");

exports.get = asyncWrapper(async (req, res) => {
  const ground = await getGround(req.params?.id);
  return sendSuccess(res, 200, "Ground fetched", ground);
});
