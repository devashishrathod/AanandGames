const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateSport } = require("../../services/sports");
const { validateUpdateSport } = require("../../validator/sports");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateSport(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const image = req.files?.image;
  const updated = await updateSport(req.params?.id, value, image);
  return sendSuccess(res, 200, "Sport updated", updated);
});
