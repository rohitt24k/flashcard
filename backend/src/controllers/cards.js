const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getAllCards(req, res) {
  try {
    const response = await prisma.qa_table.findMany({
      orderBy: [{ id: "asc" }],
    });

    if (response.length === 0) {
      return res.json({ message: "No cards found", data: [] });
    }

    res.json({ message: "Cards fetched successfully", data: response });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching cards", details: error.message });
  }
}

async function addCard(req, res) {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await prisma.qa_table.create({
      data: { question, answer },
    });

    res
      .status(201)
      .json({ message: "Card added successfully", data: response });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding card", details: error.message });
  }
}

async function editCard(req, res) {
  const { question, answer } = req.body;
  const { id } = req.params;

  if (!id || !question || !answer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if the card exists
    const existingCard = await prisma.qa_table.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Update the card if it exists
    const response = await prisma.qa_table.update({
      where: { id: Number(id) },
      data: { question, answer },
    });

    res.json({ message: "Card edited successfully", data: response });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error editing card", details: error.message });
  }
}

async function deleteCard(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Card ID is required" });
  }

  try {
    const deletedCard = await prisma.qa_table.delete({
      where: { id: Number(id) },
    });

    if (!deletedCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json({ message: "Card deleted successfully", data: deletedCard });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting card", details: error.message });
  }
}

module.exports = { getAllCards, addCard, editCard, deleteCard };
