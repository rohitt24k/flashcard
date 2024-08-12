const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newToken = token.replace("Bearer ", "");

    const decoded = jwt.verify(newToken, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // If everything is good, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid or expired token" });
    } else if (error instanceof Error) {
      return res.status(500).json({
        error: "Internal server error",
        error_message: error.message,
      });
    } else {
      return res.status(500).json({
        error: "Internal server error",
        error_message: "An unknown error occurred",
      });
    }
  }
}

module.exports = authMiddleware;
