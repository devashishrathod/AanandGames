const { asyncWrapper, sendSuccess } = require("../../utils");
const { getSportGround } = require("../../services/sportGrounds");

exports.get = asyncWrapper(async (req, res) => {
  const sportGround = await getSportGround(req.params?.id);
  return sendSuccess(res, 200, "Sport ground fetched", sportGround);
});
