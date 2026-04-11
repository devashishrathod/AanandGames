const Ground = require("../../models/Ground");
const Banner = require("../../models/Banner");
const { throwError, validateObjectId } = require("../../utils");
const { deleteImage, deleteAudioOrVideo } = require("../uploads");

exports.deleteGround = async (id) => {
  validateObjectId(id, "Ground Id");
  const ground = await Ground.findById(id);
  if (!ground || ground.isDeleted) throwError(404, "Ground not found");

  const bannerIds = Array.isArray(ground.banners) ? ground.banners : [];
  if (bannerIds.length) {
    const banners = await Banner.find({ _id: { $in: bannerIds } });
    for (const b of banners) {
      await deleteAudioOrVideo(b?.video);
      await deleteImage(b?.image);
      b.isDeleted = true;
      b.isActive = false;
      b.image = null;
      b.video = null;
      b.updatedAt = new Date();
      await b.save();
    }
  }

  ground.isDeleted = true;
  ground.isActive = false;
  ground.banners = [];
  ground.updatedAt = new Date();
  await ground.save();
  return;
};
