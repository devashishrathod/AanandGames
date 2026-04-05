const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createSport } = require("../../services/sports");
const { validateCreateSport } = require("../../validator/sports");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateSport(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const image = req.files?.image;
  const sport = await createSport(value, image);
  return sendSuccess(res, 201, "Sport created", sport);
});
