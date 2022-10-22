const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const UsersModel = require("../../../models/Users");
const { UserRoles } = require("../../../utils/constants");
const { createSalt, hashPassword, encodeJWT } = require("../../../utils/jwt");
const { validateToken } = require("../../../utils/common");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../utils/constants");
const logger = require("../../../utils/logger");

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    const user = await UsersModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with email already exists. Please sign in.",
      });
    }

    const hashedPassword = hashPassword(password, createSalt());

    const name = email.split("@")[0];

    const newUser = await new UsersModel({
      email,
      password: hashedPassword,
      role: UserRoles.OWNER,
      name,
      avatar: crypto.createHash("md5").update(email).digest("hex"),
      isEmailVerified: false,
    }).save();

    const token = encodeJWT({ userId: newUser._id });

    return res
      .status(200)
      .json({ success: true, data: { email: newUser.email, token } });
  } catch (error) {
    logger.error("POST /api/v1/users/signup -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .json({ success: false, message: "Email is required." })
        .status(400);
    }

    if (!password) {
      return res
        .json({ success: false, message: "Password is required." })
        .status(400);
    }

    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res
        .json({
          success: false,
          message:
            "User with email does not exist. Please check your credentials and try again.",
        })
        .status(400);
    }

    const salt = user.password.split("$")[0];

    const hashedPassword = hashPassword(password, salt);

    if (hashedPassword !== user.password) {
      return res.status(403).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    const token = encodeJWT({ userId: user._id });

    return res
      .status(200)
      .json({ success: true, data: { email: user.email, token } });
  } catch (error) {
    logger.error("POST /api/v1/users/signin -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.get("/info", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { userId } = token;

    const user = await UsersModel.findById(userId);

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error("POST /api/v1/users/info -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
