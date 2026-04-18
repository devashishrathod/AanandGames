const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getCourtsForSlot } = require("../../services/timeSlots");
const { validateGetCourtsForSlotQuery } = require("../../validator/timeSlots");

exports.getCourts = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetCourtsForSlotQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));

  const result = await getCourtsForSlot(value);
  return sendSuccess(res, 200, "Slot courts fetched", result);
});
