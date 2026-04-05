const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllSports } = require("../../services/sports");
const { validateGetAllSportsQuery } = require("../../validator/sports");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllSportsQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllSports(value);
  return sendSuccess(res, 200, "Sports fetched", result);
});
