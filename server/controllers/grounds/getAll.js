const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllGrounds } = require("../../services/grounds");
const { validateGetAllGroundsQuery } = require("../../validator/grounds");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error } = validateGetAllGroundsQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));

  const result = await getAllGrounds(req.query);
  return sendSuccess(res, 200, "Grounds fetched", result);
});
