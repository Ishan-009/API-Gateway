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

async function isAuthenticated(token) {
  try {
    if (!token) {
      throw new AppError("Missing JWT Token", StatusCodes.BAD_REQUEST);
    }

    const response = Auth.verifyToken(token);
    const user = await userRepository.get(response.id);
    if (!user) {
      return new AppError("User not Found", StatusCodes.NOT_FOUND);
    }
    return user.id;
  } catch (error) {
    if (error.name == "JsonWebTokenError") {
      throw new AppError("Invalid Json Web Token", StatusCodes.BAD_REQUEST);
    } else if (error.name == "TokenExpiredError") {
      throw new AppError("JWT Token Expired", StatusCodes.BAD_REQUEST);
    } else {
      handleError(error);
    }
  }
}

module.exports = {
  createUser,
  signIn,
  isAuthenticated,
};
