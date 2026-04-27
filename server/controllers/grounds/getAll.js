const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllGrounds } = require("../../services/grounds");
const { validateGetAllGroundsQuery } = require("../../validator/grounds");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllGroundsQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));

  const result = await getAllGrounds(req.userId, value);
  return sendSuccess(res, 200, "Grounds fetched", result);
});
