const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");

/** * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
async function registerUserController(req, res) {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      message: "Please Provide username, email, password",
    });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  if (isUserAlreadyExists) {
    return isUserAlreadyExists.userName == userName
      ? res.status(400).json({
          message: "Username already taken",
        })
      : res.status(400).json({
          message: "Account already exists with this email address",
        });
    // return res.status(400).json({
    //   message : 'User Already exists'
    // })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    userName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { id: user._id, userName: user.userName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
});
  res.status(201).json({
    message: "User Registered Successfully",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
  });
}

/** @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    { id: user._id, userName: user.userName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

 res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
});
  res.status(201).json({
    message: "Login Successfull",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
  });
}

/** @route POST /api/auth/logout
 * @desc Logout a user and add the token in blacklist
 * @access Public
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  }

  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
});
  res.status(200).json({
    message: "USer Logout Successfullly",
  });
}

/** @route POST /api/auth/get-me
 * @desc Get the details of the logged in user
 * @access Public
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User Fetched Successfully",
    user: {
      id: user.id,
      userName: user.userName,
      email: user.email,
    },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
