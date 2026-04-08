const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createSportGround } = require("../../services/sportGrounds");
const { validateCreateSportGround } = require("../../validator/sportGrounds");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateSportGround(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const image = req.files?.image;
  const sportGround = await createSportGround(value, image);
  return sendSuccess(res, 201, "Sport ground created", sportGround);
});
