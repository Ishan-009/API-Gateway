const { UserController } = require("../../controller/index");
const express = require("express");
const router = express.Router();
const { AuthMiddleware } = require("../../middleware");
const { Auth } = require("../../utils/common");
router.post(
  "/signup",
  AuthMiddleware.validateUserSignup,
  UserController.createUser
);
router.post(
  "/signin",
  AuthMiddleware.validateUserSignin,
  UserController.signIn
);

// Export the router
module.exports = router;
