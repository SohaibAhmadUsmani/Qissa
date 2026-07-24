import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
}

   const isMatch = await bcrypt.compare(password, user.password);

console.log("Entered Password:", password);
console.log("Stored Hash:", user.password);
console.log("Password Match:", isMatch);

if (!isMatch) {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
}


    const token = generateToken(user);

   res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  data: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});} catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};