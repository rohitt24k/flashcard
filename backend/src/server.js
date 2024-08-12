const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.js");
const cardRoutes = require("./routes/cards.js");
const authMiddleware = require("./middleware/auth.js");

config();
const app = express();

const port = 8000 || process.env.PORT;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/test", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
