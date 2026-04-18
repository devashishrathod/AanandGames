const Joi = require("joi");
const objectId = require("./validJoiObjectId");

exports.validateGetAllTimeSlotsQuery = (payload) => {
  const schema = Joi.object({
    groundId: objectId().required().messages({
      "any.required": "groundId is required",
      "any.invalid": "Invalid groundId format",
    }),
    sportId: objectId().required().messages({
      "any.required": "sportId is required",
      "any.invalid": "Invalid sportId format",
    }),
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        "any.required": "date is required",
        "string.pattern.base": "date must be in YYYY-MM-DD format",
      }),
  });

  return schema.validate(payload, { abortEarly: false });
};

exports.validateGetCourtsForSlotQuery = (payload) => {
  const schema = Joi.object({
    groundId: objectId().required().messages({
      "any.required": "groundId is required",
      "any.invalid": "Invalid groundId format",
    }),
    sportId: objectId().required().messages({
      "any.required": "sportId is required",
      "any.invalid": "Invalid sportId format",
    }),
    startTime: Joi.date().iso().required().messages({
      "any.required": "startTime is required",
      "date.format": "startTime must be ISO date",
    }),
  });

  return schema.validate(payload, { abortEarly: false });
};
