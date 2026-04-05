const Setting = require("../../models/Setting");

exports.getSetting = async () => {
  const setting = await Setting.findOne().populate({
    path: "delivery.shopLocationId",
    select:
      "name buildingNumber address area city district state country formattedAddress zipcode coordinates isVenueAddress isDefault isActive isDeleted",
  });
  return setting;
};
