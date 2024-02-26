const { UserController } = require("../../controller/index");
const express = require("express");
const router = express.Router();
router.post("/signup", UserController.createUser);
router.post("/signin", UserController.signIn);

// Export the router
module.exports = router;
