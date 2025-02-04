// client theke asa file gula upload folder e temporay rakhbo.
// then cloudinary te host korbo
import fs from "fs";

import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import multer from "multer";
// npm multer and clouninary
export const sendImageToCloudinary = async (
  path: string,
  imageName: string
) => {
  // console.log({path_name: path})
  // console.log({image_name: imageName})
  // Configuration
  //  cloudinary.config({
  //     cloud_name: 'dtp5fwvg9',
  //     api_key: '592791113848874',
  //     api_secret: '61C-JnIo59kLnXhJXHtd6G3cjmU' // Click 'View API Keys' above to copy your API secret
  // });
  cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUD_API_SECRET, // Click 'View API Keys' above to copy your API secret. web site theke
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      path,
      {
        public_id: imageName,
      }
      // kon path theke image nia cloudinary te upload korbo
    )
    .catch((error) => {
      console.log(error);
    });

  // delete a file asynchronously
  // upload folder e file dilete korbe
  fs.unlink(path, (err) => {
    if (err) {
      console.error("cant not delet file = ", err);
    } else {
      console.log("File is deleted.");
    }
  });

  return uploadResult;

  // console.log("my -res = ", uploadResult);
};

// multer dia upload folder e store korbo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/upload/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
