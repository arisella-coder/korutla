//controllers/authController.js
import bcrypt from "bcrypt";
import { Vendor, Consumer, DeliveryAgent } from "../models/users/usersModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function register(req, res) {
  try {
    const {
      name,
      email,
      username,
      password,
      role,
      storeName,
      phone,
      personaladdress,
      storeaddress,
    } = req.body;
    console.log("Registering user:", req.body);

    if (!["vendor", "consumer", "deliveryagent"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Validate required fields for vendors
    if (role === "vendor") {
      if (!storeName || !phone) {
        return res.status(400).json({
          message:
            "Missing required vendor details: storeName and phone are required.",
        });
      }
      if (!personaladdress) {
        return res
          .status(400)
          .json({ message: "Missing required personal address." });
      }
      const { hno, street, city, state, zip, country } = personaladdress;
      if (!hno || !street || !city || !state || !zip || !country) {
        return res.status(400).json({
          message:
            "Incomplete personal address details. All fields (hno, street, city, state, zip, country) are required.",
        });
      }
      if (!storeaddress) {
        return res
          .status(400)
          .json({ message: "Missing required store address." });
      }
      const {
        hno: storeHno,
        street: storeStreet,
        city: storeCity,
        state: storeState,
        zip: storeZip,
        country: storeCountry,
      } = storeaddress;
      if (
        !storeHno ||
        !storeStreet ||
        !storeCity ||
        !storeState ||
        !storeZip ||
        !storeCountry
      ) {
        return res.status(400).json({
          message:
            "Incomplete store address details. All fields (hno, street, city, state, zip, country) are required.",
        });
      }
    }

    // Check in vendor collection first (or consider checking both collections)
    let existingUser = await Vendor.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP (6-digit code)
    const { otp, otpExpires } = await generateOtp();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Encrypt the OTP using bcrypt with a new salt
    const otpHash = await bcrypt.hash(otp, 10);

    let user;
    if (role === "vendor") {
      user = new Vendor({
        name,
        email,
        username,
        password: hashedPassword,
        role,
        storeName,
        phone,
        personaladdress, // from BaseUserSchema
        storeaddress, // vendor specific
        isVerified: false,
        otp: otpHash, // store the hashed OTP
        otpExpires,
      });
    }

    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
      res.status(201).json({
        message:
          "Registration initiated. OTP sent to your email. Please verify OTP to complete registration.",
      });
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    // Look up the user in both collections
    let user =
      (await Vendor.findOne({ email })) || (await Consumer.findOne({ email }));
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isValidOTP = await bcrypt.compare(otp, user.otp);
    if (!isValidOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (new Date() > user.otpExpires) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified. Registration complete." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  return { otp, otpExpires };
}

export async function resendOTP(req, res) {
  try {
    const { email } = req.body;
    let user =
      (await Vendor.findOne({ email })) || (await Consumer.findOne({ email }));
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }
    const { otp, otpExpires } = await generateOtp();
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Your New OTP Code",
      text: `Your new OTP code is: ${otp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
      res.status(200).json({ message: "New OTP sent to your email." });
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    let user =
      (await Vendor.findOne({ email })) || (await Consumer.findOne({ email }));
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }
    const payload = { id: user._id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      user: user,
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error: " + error });
  }
}

export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const payload = { id: decoded.id, role: decoded.role };
      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ token: newAccessToken });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
