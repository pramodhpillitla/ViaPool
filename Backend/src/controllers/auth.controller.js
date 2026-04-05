import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/notification.service.js";



const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken.push({
    token: refreshToken,
    createdAt: new Date(),
  });

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone, role } = req.body;

  if (!email || !password || !firstName) {
    throw new ApiError(400, "Email, password and first name are required");
  }

  const normalizedEmail = email.toLowerCase();

  const query = [{ email: normalizedEmail }];

  if (phone) {
    query.push({ phone });
  }

  const existedUser = await User.findOne({ $or: query });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const normalizedRole = role === "driver" ? "driver" : "passenger";

  const user = await User.create({
    email: normalizedEmail,
    password,
    firstName,
    lastName,
    phone,
    role: normalizedRole,
  });

  const createdUser = user.toObject();
  delete createdUser.password;
  delete createdUser.refreshToken;

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(404, "User does not exist");

  if (user.isBlocked) {
    throw new ApiError(403, "Account is blocked");
  }

  if (user.isDeactivated) {
    throw new ApiError(403, "Account is deactivated");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token required");
  }

  await User.findByIdAndUpdate(req.user._id, {
    $pull: {
      refreshToken: { token: incomingRefreshToken },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const user = await User.findById(decoded?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (user.isBlocked) {
    throw new ApiError(403, "Account is blocked");
  }

  if (user.isDeactivated) {
    throw new ApiError(403, "Account is deactivated");
  }

  const tokenExists = user.refreshToken.some(
    (t) => t.token === incomingRefreshToken,
  );

  if (!tokenExists) {
    throw new ApiError(401, "Refresh token not recognized");
  }

  user.refreshToken = user.refreshToken.filter(
    (tokenEntry) => tokenEntry.token !== incomingRefreshToken,
  );

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully",
      ),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched"));
});

import { upload } from "../utils/s3.service.js";

const setupDriverProfile = asyncHandler(async (req, res) => {
  const {
    licenseNumber,
    brand,
    model,
    year,
    color,
    registrationNumber,
    totalSeats,
  } = req.body;
  
  const licenseImage = req.files?.licenseImage?.[0]?.location || null;
  const vehiclePhoto = req.files?.vehiclePhoto?.[0]?.location || null;

  if (
    !licenseNumber ||
    !brand ||
    !model ||
    !registrationNumber ||
    !totalSeats
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  const existingVehicle = await Vehicle.findOne({ registrationNumber });
  if (existingVehicle) {
    throw new ApiError(409, "Vehicle already registered");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        role: "driver",
        "drivingLicense.licenseNumber": licenseNumber,
        "drivingLicense.licenseImage": licenseImage,
      },
      { new: true, session },
    ).select("-password -refreshToken");

    const vehicleResult = await Vehicle.create(
      [
        {
          owner: user._id,
          brand,
          model,
          year,
          color,
          registrationNumber,
          totalSeats,
          photos: vehiclePhoto ? [vehiclePhoto] : [],
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user, vehicle: vehicleResult[0] },
          "Driver profile created",
        ),
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, bio, tagline, email, privacy } = req.body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : undefined;
  const normalizedPhone = typeof phone === "string" ? phone.trim() : undefined;
  const updateFields = {};

  if (firstName !== undefined) updateFields.firstName = firstName;
  if (lastName !== undefined) updateFields.lastName = lastName;
  if (bio !== undefined) updateFields.bio = bio;
  if (tagline !== undefined) updateFields.tagline = tagline;
  if (normalizedEmail !== undefined) updateFields.email = normalizedEmail;
  if (normalizedPhone !== undefined) updateFields.phone = normalizedPhone || undefined;

  if (privacy) {
    updateFields.privacy = { ...req.user.privacy, ...privacy };
  }

  if (normalizedEmail) {
    const existingEmailUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    }).select("_id");

    if (existingEmailUser) {
      throw new ApiError(409, "This email address is already in use");
    }
  }

  if (normalizedPhone) {
    const existingPhoneUser = await User.findOne({
      phone: normalizedPhone,
      _id: { $ne: req.user._id },
    }).select("_id");

    if (existingPhoneUser) {
      throw new ApiError(409, "This phone number is already in use");
    }
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: updateFields,
      },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
      new ApiResponse(200, user, "Profile updated successfully")
    );
  } catch (error) {
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      if (duplicateField === "phone") {
        throw new ApiError(409, "This phone number is already in use");
      }
      if (duplicateField === "email") {
        throw new ApiError(409, "This email address is already in use");
      }
      throw new ApiError(409, "A unique profile field is already in use");
    }

    throw error;
  }
});

const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { isDeactivated: true },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, {}, "Account deactivated successfully")
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Return success even if user not found to prevent email enumeration
    return res.status(200).json(
      new ApiResponse(200, {}, "If an account exists with this email, a reset link has been sent")
    );
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Save hashed token and expiry to user
  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

  // Send email
  try {
    await sendEmail({
      to: user.email,
      subject: "ViaPool - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D4A35;">Password Reset Request</h2>
          <p>You requested a password reset for your ViaPool account.</p>
          <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #C4622D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">ViaPool - Smarter Carpooling</p>
        </div>
      `,
    });
  } catch (error) {
    // Clear reset token if email fails
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Failed to send reset email. Please try again later.");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "If an account exists with this email, a reset link has been sent")
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new ApiError(400, "Token and password are required");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  // Hash the token from URL
  const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with valid reset token
  const user = await User.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // Update password and clear reset token
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, {}, "Password reset successfully")
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  setupDriverProfile,
  updateProfile,
  deactivateUser,
  forgotPassword,
  resetPassword
};
