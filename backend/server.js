const express = require("express");
const cors = require("cors");
let cookies = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = 3000 | process.env.PORT;
app.use(
  cors({
    origin: [""],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookies());

app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});
