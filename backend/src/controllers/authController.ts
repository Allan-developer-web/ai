import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";

function setAuthCookie(res: Response, token: string) {
  const production = process.env.NODE_ENV === "production";

  res.cookie("foodies_token", token, {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export async function register(
  req: Request,
  res: Response
) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must contain at least 8 characters",
    });
  }

  const normalizedEmail =
    email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    return res.status(409).json({
      message: "An account with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    12
  );

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
  });

  return res.status(201).json({
    message: "Account created successfully. Please Login",
    redirect: "/login",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function login(
  req: Request,
  res: Response
) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
  const token = generateToken(user._id.toString(), user.role);
  setAuthCookie(res, token);

  return res.json({
    message: "Login successful",
    redirect: "/dashboard",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function logout(
  req: Request,
  res: Response
) {
  res.clearCookie("foodies_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    path: "/",
  });

  return res.json({
    message: "Logged out successfully",
    redirect: "/",
  });
}