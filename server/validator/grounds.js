const Joi = require("joi");
const objectId = require("./validJoiObjectId");

exports.validateCreateGround = (payload) => {
  const createSchema = Joi.object({
    name: Joi.string().min(2).max(120).required(),
    description: Joi.string().allow("").max(500).optional(),
    venueId: objectId().required().messages({
      "any.required": "venueId is required",
      "any.invalid": "Invalid venueId format",
    }),
    sportId: objectId().required().messages({
      "any.required": "sportId is required",
      "any.invalid": "Invalid sportId format",
    }),
    type: Joi.string().min(2).max(50).required(),
    openingTime: Joi.string().required(),
    closingTime: Joi.string().required(),
    pricePerHour: Joi.number().min(0).required(),
    status: Joi.string().valid("available", "booked", "maintenance").optional(),
    isActive: Joi.boolean().optional(),
  });

  return createSchema.validate(payload, { abortEarly: false });
};

exports.validateUpdateGround = (payload) => {
  const updateSchema = Joi.object({
    name: Joi.string().min(2).max(120).optional(),
    description: Joi.string().allow("").max(500).optional(),
    venueId: objectId().optional().messages({
      "any.invalid": "Invalid venueId format",
    }),
    sportId: objectId().optional().messages({
      "any.invalid": "Invalid sportId format",
    }),
    type: Joi.string().min(2).max(50).optional(),
    openingTime: Joi.string().optional(),
    closingTime: Joi.string().optional(),
    pricePerHour: Joi.number().min(0).optional(),
    status: Joi.string().valid("available", "booked", "maintenance").optional(),
    isActive: Joi.alternatives().try(Joi.string(), Joi.boolean()).optional(),
  });

  return updateSchema.validate(payload, { abortEarly: false });
};

exports.validateGetAllGroundsQuery = (payload) => {
  const getAllQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    name: Joi.string().optional(),
    venueId: objectId().optional().messages({
      "any.invalid": "Invalid venueId format",
    }),
    sportId: objectId().optional().messages({
      "any.invalid": "Invalid sportId format",
    }),
    type: Joi.string().optional(),
    status: Joi.string().valid("available", "booked", "maintenance").optional(),
    isActive: Joi.alternatives().try(Joi.string(), Joi.boolean()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });

  return getAllQuerySchema.validate(payload, { abortEarly: false });
};
