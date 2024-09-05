import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { uploadImage } from "../middleware/uploadImage.js";
import deepEmailValidator from 'deep-email-validator';

async function validateEmail(email) {
  const { valid, reason, validators } = await deepEmailValidator.validate(email);

  if (valid) {
      console.log("Email is valid");
  } else {
      console.log(`Email is invalid: ${reason}`);
      console.log(validators);
  }

  return { valid, reason, validators };
}

/* REGISTER USER */
/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picture,
      friends,
      location,
      occupation,
    } = req.body;

    // Validate email
    const emailValidation = await validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        error: "Invalid email address",
        reason: emailValidation.reason,
        validators: emailValidation.validators,
      });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Upload the picture and get the URL
    const url = await uploadImage(picture);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: url,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ error: "User does not exist. " });

    if (user.googleId) {
      // If the user has a Google ID, they must use Google OAuth to log in
      return res.status(400).json({ error: "Please use Google OAuth to log in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
