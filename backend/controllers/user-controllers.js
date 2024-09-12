import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import asyncHandler from "express-async-handler";
import { Sequelize } from "sequelize";

const User = db.user;
const Op = Sequelize.Op;

// @desc  add new user
// @route POST api/v1/user/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, contact, role } = req.body;

  try {
    // Checking if the user is already in the database
    const alreadyUser = await User.findOne({ where: { email } });

    if (alreadyUser) {
      res.status(400);
      throw new Error(`User '${email}' already exists!`);
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashPassword,
      contact_number: contact,
      role,
    });

    res.status(201).json({ message: "Thanks for registering", user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc  login user
// @route POST api/v1/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(400);
      throw new Error(`User '${email}' not found!`);
    }

    // Check password validity
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      res.status(400);
      throw new Error("Email or password does not match!");
    }

    // Create and set refresh token
    const refreshToken = createRefreshToken({
      id: user.user_id,
      role: user.role,
    });
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "/api/v1/user/refreshToken",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Create access token
    const accessToken = createAccessToken({
      id: user.user_id,
      role: user.role,
    });

    const userData = {
      id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };

    res.json({
      message:
        user.role === 1
          ? "Welcome to the admin panel"
          : "Welcome back! Login successful",
      refreshToken,
      accessToken,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc  Get Access Token
// @route POST /api/v1/user/refreshToken
// @access Public
const getAccessToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken)
      return res.status(400).json({ msg: "Please login now!" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "Please login now!" });

      const accessToken = createAccessToken({ id: user.id, role: user.role });
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @desc  logout user / clear cookie
// @route GET api/v1/user/logout
// @access PRIVATE
const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/v1/user/refreshToken" });
    res.json({ msg: "Logged out!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// @desc  get user profile
// @route GET api/v1/user/userProfile
// @access PRIVATE
const getUserProfile = async (req, res) => {
  try {
    // Log the user ID from the token
    // console.log("User ID from token:", req.user.id);

    // Fetch the user profile from the database
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    // Log the fetched user data
    // console.log("Fetched User Profile:", user);

    // If user is not found, log and return a 404 status
    if (!user) {
      // console.log("User not found");
      return res.status(404).json({ msg: "User not found" });
    }

    // Send the user profile as the response
    res.json(user);
  } catch (err) {
    // Log the error
    console.error("Error fetching user profile:", err.message);

    // Send a 500 status and error message
    res.status(500).json({ msg: "Internal server error" });
  }
};

// @desc  To get all users info
// @route POST /api/v1/user/allUsersInfo
// @access Protected (auth + admin)
const getAllUsersInfo = asyncHandler(async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      where: {
        user_id: {
          [Op.ne]: req.user.id,
        },
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @desc  forget password
// @route POST api/v1/user/forgotPassword
// @access PUBLIC
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: "This email does not exist!" });
    }

    const accessToken = createAccessToken({
      id: user.user_id,
      email: user.email,
    });
    const url = `http://localhost:3000/api/v1/user/reset/${accessToken}`;

    res.json({
      message: "Password reset email sent. Please check your email to reset.",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @desc  reset password
// @route POST api/v1/user/resetPassword
// @access PUBLIC
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  try {
    const passwordHash = bcrypt.hashSync(password, 10);
    await User.update(
      { password: passwordHash },
      { where: { user_id: req.user.id } }
    );

    res.json({ message: "Password successfully changed!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @desc  update password
// @route PUT api/v1/user/updatePassword
// @access PRIVATE
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Current password does not match!" });
    }

    const newHashPassword = bcrypt.hashSync(newPassword, 10);
    user.password = newHashPassword;
    await user.save();

    res.json({ message: "Password Updated Successfully!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @desc  update user details
// @route PUT /api/v1/user/update
// @access PRIVATE
const updateUserDetails = asyncHandler(async (req, res) => {
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
  } catch (error) {
    res
      .status(500)
      .json({ msg: "User details could not be updated. Try again!" });
  }
});

// @desc  delete user
// @route DELETE /api/v1/user/:id
// @access PRIVATE (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.destroy({ where: { user_id: id } });

    if (user) {
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Utility functions to create tokens
const createAccessToken = (payload) => {
  return jwt.sign(
    { id: payload.id, role: payload.role }, // Include role in the payload
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (payload) => {
  return jwt.sign(
    { id: payload.id, role: payload.role }, // Include role in the payload
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
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
  deleteUser,
};
