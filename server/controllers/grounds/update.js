const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateGround } = require("../../services/grounds");
const { validateUpdateGround } = require("../../validator/grounds");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateGround(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const banners = req.files?.banners;
  const updated = await updateGround(req.params?.id, value, banners);
  return sendSuccess(res, 200, "Ground updated", updated);
});
