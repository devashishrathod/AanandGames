const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllCourts } = require("../../services/courts");
const { validateGetAllCourtsQuery } = require("../../validator/courts");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error } = validateGetAllCourtsQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));

  const result = await getAllCourts(req.query);
  return sendSuccess(res, 200, "Courts fetched", result);
});
