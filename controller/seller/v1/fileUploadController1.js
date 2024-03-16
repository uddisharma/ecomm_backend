const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const AWS = require("aws-sdk");
const crypto = require("crypto");
const sharp = require("sharp");
const randomname = (length) => crypto.randomBytes(length).toString("hex");

let allowedFileTypes = ["png", "jpeg", "jpg", "gif", "pdf", "doc", "docx"];
let maxFileSize = 5; //In Megabyte

const upload = async (req, res) => {
  try {
    const options = {
      multiples: true,
      maxFileSize: 300 * 1024 * 1024, //300 MB
      maxFieldsSize: 100 * 1024 * 1024, //50 MB
    };
    const form = new formidable.IncomingForm(options);

    const uploadFileRes = await new Promise(async (resolve, reject) => {
      form.parse(req, async function (error, fields, files) {
        if (error) {
          reject(error);
        }

        let uploadSuccess = [];
        let uploadFailed = [];
        let fileCount = 1;

        let fileArr = [];
        if (!files["files"]) {
          reject({
            message: "Select at least one file to upload.",
            name: "validationError",
          });
        }
        if (!Array.isArray(files["files"])) {
          fileArr.push(files["files"]);
          files["files"] = fileArr;
        }

        for (let file of files["files"]) {
          let response = await uploadFiles(file, fields, fileCount++);
          if (response.status == false) {
            uploadFailed.push({
              name: file.originalFilename,
              error: response.message,
              status: false,
            });
          } else {
            uploadSuccess.push({
              name: file.originalFilename,
              path: response.data,
              status: true,
            });
          }
        }

        resolve({
          uploadSuccess,
          uploadFailed,
        });
      });
    });

    if (uploadFileRes.uploadSuccess.length > 0) {
      let message = `${
        uploadFileRes.uploadSuccess.length
      } File uploaded successfully out of ${
        uploadFileRes.uploadSuccess.length + uploadFileRes.uploadFailed.length
      }`;
      return res.success({
        message: message,
        data: uploadFileRes,
      });
    } else {
      let message = "Failed to upload files.";
      return res.failure({
        message: message,
        data: uploadFileRes,
      });
    }
  } catch (error) {
    if (error.name && error.name == "validationError") {
      return res.validationError({ message: error.message });
    } else {
      return res.internalServerError({ message: error.message });
    }
  }
};

const uploadFiles = async (file, fields, fileCount) => {
  let extension = path.extname(file.originalFilename);
  extension = extension.split(".").pop();

  fileType = file.mimetype;

  if (allowedFileTypes.length == 0 || !allowedFileTypes.includes(extension)) {
    return {
      status: false,
      message: "Filetype not allowed.",
    };
  }

  // Check File Size
  const fileSize = file.size / 1024 / 1024;
  if (maxFileSize < fileSize) {
    return {
      status: false,
      message: `Allow file size upto ${maxFileSize} MB.`,
    };
  }

  let fileName = randomname(32);

  const response = await new Promise(async (resolve, reject) => {
    resolve(await uploadToS3(file, fileName));
  });

  return response;
};

const uploadToS3 = async (file, fileName) => {
  let S3Config = {
    AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  };

  const s3 = new AWS.S3({
    region: S3Config.AWS_S3_REGION,
    accessKeyId: S3Config.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: S3Config.AWS_S3_SECRET_ACCESS_KEY,
  });

  const optimizedImage = await sharp(file.filepath)
    .resize({ width: 800 })
    .jpeg({ quality: 75 })
    .toBuffer();

  let params = {
    Bucket: S3Config.AWS_S3_BUCKET_NAME,
    Body: optimizedImage,
    Key: fileName,
  };

  const response = await new Promise(async (resolve, reject) => {
    s3.putObject(params, function (error, data) {
      if (error) {
        resolve({
          status: false,
          message: error.message,
        });
      } else {
        resolve({
          status: true,
          data: process.env.AWS_CDN_LINK + fileName,
        });
      }
    });
  });

  return response;
};

module.exports = { upload };
