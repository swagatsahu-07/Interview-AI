const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");

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
      ? res.status(400).json({ message: "Username already taken" })
      : res.status(400).json({ message: "Account already exists with this email address" });
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
    { expiresIn: "1d" }
  );


  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User Registered Successfully",
    token, 
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
  });
}

async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id, userName: user.userName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

 
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "Login Successfull",
    token, 
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
  });
}

async function logoutUserController(req, res) {

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

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
    message: "User Logout Successfully",
  });
}

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