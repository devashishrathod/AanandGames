const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createVenue } = require("../../services/venues");
const { validateCreateVenue } = require("../../validator/venues");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateVenue(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const image = req.files?.image;
  const venue = await createVenue(value, image);
  return sendSuccess(res, 201, "Venue created", venue);
});
