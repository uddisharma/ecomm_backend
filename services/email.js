
const nodemailer = require("nodemailer");
const ejs = require("ejs");

let config = {
  service: "gmail",
  auth: {
    user: "uddibhardwaj08@gmail.com",
    pass: "jjakxuuduudiywaz",
  },
};
let transporter = nodemailer.createTransport(config);

const sendMail = async (obj) => {
  if (!Array.isArray(obj.to)) {
    obj.to = [obj.to];
  }

  let htmlText = "";
  if (obj.template) {
    htmlText = await ejs.renderFile(
      `${__basedir}${obj.template}/html.ejs`,
      obj.data || null
    );
  }

  let mailOpts = {
    from: obj.from || "noreply@yoyo.co",
    subject: obj.subject || "Sample Subject",
    to: obj.to,
    cc: obj.cc || [],
    bcc: obj.bcc || [],
    html: htmlText,
    attachments: obj.attachments || [],
  };
  return transporter.sendMail(mailOpts);
};

module.exports = { sendMail };
