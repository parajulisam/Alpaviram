import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import asynchandler from "express-async-handler";
import { Sequelize } from "sequelize";

const User = db.user;
const Op = Sequelize.Op;

// @desc  add new user
// @route POST api/v1/user/register
// @access Public

const registerUser = asynchandler(async (req, res) => {
  const { firstName, lastName, email, password, contact, role } = req.body;

  try {
    //checking if the user is already in the database.
    const alreadyUser = await User.findOne({ where: { email } }).catch(
      (error) => {
        console.log("Error : ", error);
      }
    );

    //throw message if user already exists
    if (alreadyUser) {
      res.status(400);
      throw new Error(`User '${email}' already exists!`);
    }

    const hashPassword = bycrypt.hashSync(password, 10);
    const newUser = new User({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashPassword,
      contact_number: contact,
      role: role,
    });
    //saving the new user in the database
    const savedUser = await newUser.save().catch((err) => {
      console.log("Error : ", err);
      res.status(500);
      throw new Error("Cannot register user at the moment!");
    });

    //throw success message if the user is saved in the database
    if (savedUser) {
      res.json({ messgae: "Thanks for registering" });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc  login user
// @route POST api/v1/user/login
// @access Public

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  //first of all, check user with email exist or not
  const userWithEmail = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log("Error : ", err);
    }
  );

  if (!userWithEmail) {
    // return res.status(404).json({ message: "User not found" });
    res.status(400);
    throw new Error(`User '${email}' not found!`);
  }

  //now check the password
  const isPasswordValid = await bycrypt.compare(
    password,
    userWithEmail.password
  );

  if (!isPasswordValid) {
    res.status(400);
    throw new Error("Email or password does not match!");
    // return res.status(401).json({ message: "Email or passwprd is wrong." });
  }

  const refreshToken = createRefreshToken({ id: userWithEmail.user_id });

  // setting refresh token in the cookie
  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    // path to get refresh token
    path: "/api/v1/user/refreshToken",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  //checking if the user is admin
  //default is 0 which is customer and 1 is for admin
  if (userWithEmail.role === 1) {
    return res.json({ message: "Welcome to admin panel", refreshToken });
  }
  //message after succesfull login
  res.json({ message: "Welcome back! Login successful", refreshToken });
});

// @desc    Get Access Token
// @route   POST /api/v1/user/refreshToken
// @access  Public (anything can hit it)
// to get access token
// refresh token is set in cookie
// in every refresh of the page
// a call is made to get the access token
// so that the access token can be used
// to access protected routes
const getAccessToken = async (req, res) => {
  try {
    // accesssing refresh token from cookie
    const refreshToken = req.cookies.refreshtoken;
    // if there is no refresh token
    if (!refreshToken)
      return res.status(400).json({ msg: "Please login now!" });

    // if there is refresh token
    // verify the refresh token
    // user = {id: someValue}
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "Please login now!" });

      // create access token
      const accessToken = createAccessToken({ id: user.id });

      // Sending access token as response
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc  logout user / clear cookie
// @route get api/v1/user/logout
// @access PRIVATE

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/v1/user/refreshToken" });
    return res.json({ msg: "Logged out!" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
};
// @desc  get user profile
// @route GET api/v1/user/userProfile
// @access PRIVATE

const getUserProfile = async (req, res) => {
  //displays the user profile according to the token with whom it is attached
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    res.json(user);
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
};

// @desc    To get all users info
// @route   POST /api/v1/user/allUsersInfo
// @access  Protected (auth + admin)
const getAllUsersInfo = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },

      where: {
        user_id: {
          [Op.ne]: req.user.id,
        },
      },
    });

    res.json(users);
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
};

// @desc  forget password
// @route POST api/v1/user/forgotPassword
// @access PUBLIC

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  //extracting the user from the provided email
  const user = await User.findOne({ where: { email } }).catch((err) =>
    console.log("Error :", err)
  );

  // if user does not exist with the email
  if (!user) {
    res.status(400);
    throw new Error("This email does not exist!");
  }

  // if user exist

  const accessToken = createAccessToken({ id: user.id, email: user.email });

  // frontend link to enter a new password
  const url = `http://localhost:3000/api/v1/user/reset/${accessToken}`;

  // console.log(url);
  res.json({
    message:
      "Password reset email sent to your mail. Please check your mail to reset.",
  });
};

// @desc  reset password
// @route POST api/v1/user/resetPassowrd
// @access PUBLIC

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    // console.log(password);

    const passwordHash = await bycrypt.hash(password, 10);

    await User.update(
      {
        password: passwordHash,
      },
      { where: { id: req.user.id } }
    );

    res.json({ message: "Password successfully changed!" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
};

// @desc  update password
// @route PUT api/v1/user/updatePassword
// @access PRIVATE

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // finding user
    const user = await User.findByPk(req.user.id);

    // comparing the password
    const isPasswordValid = await bycrypt.compare(
      currentPassword,
      user.password
    );

    // checkiing if the old password matches
    if (!isPasswordValid) {
      res.status(400);
      throw new Error("Current password does not match!");
    }

    //hashing the new password
    const newHashPassword = bycrypt.hashSync(newPassword, 10);

    //updating the password
    user.password = newHashPassword;

    await user.save();

    res.json({ message: "Password Updated Successfully!" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    To reset password
// @route   POST /api/v1/user/reset
// @access  Public (anything can hit it)
const updateUserDetails = async (req, res) => {
  try {
    const { firstName, lastName, contactNumber } = req.body;

    const user = await User.findByPk(req.user.id);

    if (user) {
      user.first_name = firstName || user.first_name;
      user.last_name = lastName || user.last_name;
      user.contact_number = contactNumber || user.contact_number;

      await user.save();
    }

    res.json({ message: "User details updated successfully" });
  } catch (err) {
    res.status(500);
    throw new Error(
      "User details could not be updated at this moment. Try again!"
    );
  }
};

// access tokken for forget password
// expires in 15m

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export {
  registerUser,
  updateUserDetails,
  loginUser,
  forgotPassword,
  getAllUsersInfo,
  getUserProfile,
  logout,
  getAccessToken,
  resetPassword,
  updatePassword,
};
