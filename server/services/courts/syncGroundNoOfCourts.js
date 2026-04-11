const Court = require("../../models/Court");
const Ground = require("../../models/Ground");
const { validateObjectId } = require("../../utils");

exports.syncGroundNoOfCourts = async (groundId) => {
  validateObjectId(groundId, "Ground Id");

  const count = await Court.countDocuments({ groundId, isDeleted: false });
  await Ground.updateOne(
    { _id: groundId, isDeleted: false },
    { $set: { noOfCourts: count, updatedAt: new Date() } },
  );

  return count;
};
