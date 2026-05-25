const express = require("express");

const authRouter = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware")
const asyncHandler = require("../utils/asyncHandler")


/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post(
  "/register",
  asyncHandler(authController.registerUserController)
);
/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", asyncHandler(authController.loginUserController))
/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", asyncHandler(authController.logoutUserController))


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, asyncHandler(authController.getMeController))

module.exports = authRouter;