const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories/index");
const {
  ErrorResponse,
  SuccessResponse,
  handleError,
} = require("../utils/common/index");
const bcrypt = require("bcrypt");
const AppError = require("../utils/errors/app-error");
const userRepository = new UserRepository();
const { Auth } = require("../utils/common");
async function createUser(data) {
  try {
    const user = await userRepository.create(data);
    return user;
  } catch (error) {
    handleError(error);
  }
}

async function signIn(data) {
  try {
    const user = await userRepository.getUserByEmail(data.email); // Await here

    if (!user) {
      throw new AppError(
        "No user found for given email",
        StatusCodes.NOT_FOUND
      );
    }

    const isValidPassword = Auth.checkPassword(data.password, user.password);

    if (!isValidPassword) {
      throw new AppError(
        "Incorrect Credentials",
        StatusCodes.BAD_REQUEST,
        true
      );
    }

    const jwt = Auth.createToken({ id: user.id, email: user.email });

    return jwt;
  } catch (error) {
    handleError(error);
  }
}

module.exports = {
  createUser,
  signIn,
};
