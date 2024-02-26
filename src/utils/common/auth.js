const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config/index");
function checkPassword(plainPassword, encryptedPassword) {
  try {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function createToken(input) {
  try {
    return jwt.sign(input, ServerConfig.JWT_SECRET_KEY, {
      expiresIn: ServerConfig.JWT_EXPIRY,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, ServerConfig.JWT_SECRET_KEY);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  checkPassword,
  createToken,
  verifyToken,
};
