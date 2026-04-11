const Court = require("../../models/Court");
const Ground = require("../../models/Ground");
const { throwError, validateObjectId } = require("../../utils");
const { syncGroundNoOfCourts } = require("./syncGroundNoOfCourts");

exports.createCourt = async (payload) => {
  let { name, description, groundId, pricePerHour, status, isActive } = payload;

  validateObjectId(groundId, "Ground Id");
  const ground = await Ground.findById(groundId);
  if (!ground || ground.isDeleted) throwError(404, "Ground not found");

  name = name?.toLowerCase();
  description = description?.toLowerCase();

  const existing = await Court.findOne({ groundId, name, isDeleted: false });
  if (existing) throwError(400, "Court already exist with this name");

  const created = await Court.create({
    name,
    description,
    groundId,
    pricePerHour,
    status,
    isActive,
  });

  await syncGroundNoOfCourts(groundId);

  return await Court.findById(created._id)
    .populate({
      path: "groundId",
      select:
        "name type noOfCourts openingTime closingTime pricePerHour status",
      populate: [
        { path: "venueId", select: "name description image" },
        { path: "sportId", select: "name description image" },
      ],
    })
    .select("-isDeleted");
};
