const express = require("express");
const { signin, signup, isLoggedIn } = require("../controllers/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", signin);
router.get("/is-logged-in", isLoggedIn);

module.exports = router;
