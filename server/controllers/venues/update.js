const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateVenue } = require("../../services/venues");
const { validateUpdateVenue } = require("../../validator/venues");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateVenue(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const image = req.files?.image;
  const updated = await updateVenue(req.params?.id, value, image);
  return sendSuccess(res, 200, "Venue updated", updated);
});
