const Court = require("../../models/Court");
const Ground = require("../../models/Ground");
const { throwError, validateObjectId } = require("../../utils");
const { syncGroundNoOfCourts } = require("./syncGroundNoOfCourts");

exports.updateCourt = async (id, payload = 0) => {
  validateObjectId(id, "Court Id");
  const court = await Court.findById(id);
  if (!court || court.isDeleted) throwError(404, "Court not found");

  const oldGroundId = String(court.groundId);

  if (payload) {
    let { name, description, groundId, pricePerHour, status, isActive } =
      payload;

    if (groundId) {
      validateObjectId(groundId, "Ground Id");
      const ground = await Ground.findById(groundId);
      if (!ground || ground.isDeleted) throwError(404, "Ground not found");
      court.groundId = groundId;
    }

    if (name) {
      name = name.toLowerCase();
      const existing = await Court.findOne({
        _id: { $ne: id },
        groundId: court.groundId,
        name,
        isDeleted: false,
      });
      if (existing) throwError(400, "Another court exists with this name");
      court.name = name;
    }

    if (typeof isActive !== "undefined") {
      court.isActive = !court.isActive;
    }

    if (description) court.description = description?.toLowerCase() || "";
    if (typeof pricePerHour !== "undefined") court.pricePerHour = pricePerHour;
    if (status) court.status = status;
  }

  court.updatedAt = new Date();
  await court.save();

  const newGroundId = String(court.groundId);
  await syncGroundNoOfCourts(newGroundId);
  if (oldGroundId !== newGroundId) await syncGroundNoOfCourts(oldGroundId);

  return await Court.findById(id)
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
