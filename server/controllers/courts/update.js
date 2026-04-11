const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateCourt } = require("../../services/courts");
const { validateUpdateCourt } = require("../../validator/courts");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateCourt(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const updated = await updateCourt(req.params?.id, value);
  return sendSuccess(res, 200, "Court updated", updated);
});
