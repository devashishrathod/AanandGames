const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createGround } = require("../../services/grounds");
const { validateCreateGround } = require("../../validator/grounds");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateGround(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const banners = req.files?.banners;
  const ground = await createGround(value, banners);
  return sendSuccess(res, 201, "Ground created", ground);
});
