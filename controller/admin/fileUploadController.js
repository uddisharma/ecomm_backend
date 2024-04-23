const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const validUrl = require("valid-url");

let defaultDirectory = "public/assets";
let allowedFileTypes = [
  "png",
  "jpeg",
  "jpg",
  "gif",
  "pdf",
  "doc",
  "docx",
  "msword",
  "vnd.openxmlformats-officedocument.wordprocessingml.document",
  "xls",
  "xlsx",
  "vnd.ms-excel",
  "json",
  "x-msdos-program",
  "x-msdownload",
  "exe",
  "x-ms-dos-executable",
];
let maxFileSize = 5;

const upload = async (req, res) => {
  try {
    await makeDirectory(defaultDirectory);

    const options = {
      multiples: true,
      maxFileSize: 300 * 1024 * 1024,
      maxFieldsSize: 100 * 1024 * 1024,
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
            let url = response.data;
            if (!validUrl.isUri(response.data)) {
              response.data = response.data.replace("/public", "");
              url = `${response.data}`;
            }
            uploadSuccess.push({
              name: file.originalFilename,
              path: url,
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

const makeDirectory = async (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.promises.mkdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        return false;
      }
      return true;
    });
  }
  return true;
};

const uploadFiles = async (file, fields, fileCount) => {
  let tempPath = file.filepath;
  let unlink;
  let fileName = file.originalFilename;

  let extension = path.extname(file.originalFilename);
  extension = extension.split(".").pop();

  fileType = file.mimetype;

  if (allowedFileTypes.length == 0 || !allowedFileTypes.includes(extension)) {
    return {
      status: false,
      message: "Filetype not allowed.",
    };
  }

  const fileSize = file.size / 1024 / 1024;
  if (maxFileSize < fileSize) {
    return {
      status: false,
      message: `Allow file size upto ${maxFileSize} MB.`,
    };
  }

  let newPath =
    defaultDirectory +
    "/" +
    new Date().getTime() +
    path.extname(file.originalFilename);

  if (fields && fields.folderName) {
    let newDir = defaultDirectory + "/" + fields.folderName;
    const createDir = await makeDirectory(newDir);
    if (createDir) {
      if (fields.fileName) {
        newPath =
          newDir +
          "/" +
          fields.fileName +
          "-" +
          fileCount +
          path.extname(file.originalFilename);
        fileName = fields.fileName;
      }
    }
  } else if (fields && fields.fileName) {
    newPath =
      defaultDirectory +
      "/" +
      fields.fileName +
      "-" +
      fileCount +
      path.extname(file.originalFilename);
    fileName = fields.fileName;
  }

  const response = await new Promise(async (resolve, reject) => {
    fs.readFile(tempPath, function (error, data) {
      fs.writeFile(newPath, data, async function (error) {
        //Remove file from temp
        unlink = await unlinkFile(tempPath);

        if (unlink.status == false) {
          reject(unlink);
        } else {
          resolve({
            status: true,
            message: "File upload successfully.",
            data: "/" + newPath,
          });
        }
      });
    });
  });

  return response;
};

const unlinkFile = async (path) => {
  fs.unlink(path, function (error) {
    if (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  });

  return { status: true };
};

module.exports = { upload };
