const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateSportGround } = require("../../services/sportGrounds");
const { validateUpdateSportGround } = require("../../validator/sportGrounds");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateSportGround(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const image = req.files?.image;
  const updated = await updateSportGround(req.params?.id, value, image);
  return sendSuccess(res, 200, "Sport ground updated", updated);
});
