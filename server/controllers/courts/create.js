const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createCourt } = require("../../services/courts");
const { validateCreateCourt } = require("../../validator/courts");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateCourt(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const result = await createCourt(value);
  return sendSuccess(res, 201, "Court created", result);
});
