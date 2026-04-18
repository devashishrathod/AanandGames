const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllTimeSlots } = require("../../services/timeSlots");
const { validateGetAllTimeSlotsQuery } = require("../../validator/timeSlots");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllTimeSlotsQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));

  const result = await getAllTimeSlots(value);
  return sendSuccess(res, 200, "Time slots fetched", result);
});
