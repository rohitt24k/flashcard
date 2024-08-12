const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await prisma.users.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (user) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await prisma.users.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password_hash,
      },
    });

    console.log(newUser);
    res
      .status(200)
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Internal server error", error_message: error.message });
    } else {
      res.status(500).json({
        error: "Internal server error",
        error_message: "an unknown error occured",
      });
    }
  }
}

async function signin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await prisma.users.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET
    );

    let currentDate = new Date();

    let oneMonthFromNow = new Date(
      currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const cookieOptions = {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      expires: oneMonthFromNow,
    };

    res
      .status(200)
      .cookie("token", `Bearer ${token}`, cookieOptions)
      .json({ message: "User signed in" });
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Internal server error", error_message: error.message });
    } else {
      res.status(500).json({
        error: "Internal server error",
        error_message: "an unknown error occured",
      });
    }
  }
}

function isLoggedIn(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const newToken = token.replace("Bearer ", "");

    const decoded = jwt.verify(newToken, process.env.JWT_SECRET);

    res.status(200).json({ message: "User is logged in", data: decoded });
  } catch (error) {
    console.log(error);

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid or expired token" });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Internal server error", error_message: error.message });
    } else {
      res.status(500).json({
        error: "Internal server error",
        error_message: "An unknown error occurred",
      });
    }
  }
}

module.exports = { isLoggedIn, signin, signup };
