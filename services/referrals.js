const CryptoJS = require("crypto-js");

function generateReferralCode(name, email, phoneNumber) {
  const userString = `${name}${email}${phoneNumber}`;

  const hash = CryptoJS.SHA256(userString).toString(CryptoJS.enc.Hex);

  const referralCode = hash.substring(0, 8).toUpperCase();

  return referralCode;
}
module.exports = generateReferralCode;
