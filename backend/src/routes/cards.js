const express = require("express");
const {
  getAllCards,
  addCard,
  editCard,
  deleteCard,
} = require("../controllers/cards");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllCards);
router.post("/", authMiddleware, addCard);
router.patch("/:id", authMiddleware, editCard);
router.delete("/:id", authMiddleware, deleteCard);

module.exports = router;
