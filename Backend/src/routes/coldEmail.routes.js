const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const coldEmailController = require("../controllers/coldEmail.controller")
const upload = require("../middlewares/file.middleware")
const asyncHandler = require("../utils/asyncHandler")

const coldEmailRouter = express.Router()

coldEmailRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    asyncHandler(coldEmailController.generateColdEmailController)
)

coldEmailRouter.get(
    "/",
    authMiddleware.authUser,
    asyncHandler(coldEmailController.getAllColdEmailsController)
)

coldEmailRouter.get(
    "/:coldEmailId",
    authMiddleware.authUser,
    asyncHandler(coldEmailController.getColdEmailByIdController)
)

module.exports = coldEmailRouter
