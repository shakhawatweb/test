import express from "express";

import Book from "../models/Book.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { title: new RegExp(search, "i") },
            { author: new RegExp(search, "i") },
            { isbn: new RegExp(search, "i") }
          ]
        }
      : {};

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Unable to load books" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: "Invalid book id" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, author, isbn, category, publishYear } = req.body;
    if (!title || !author || !isbn || !category || !publishYear) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const book = new Book(req.body);
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid book id" });
  }
});

export default router;
