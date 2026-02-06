import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    publishYear: { type: Number, required: true },
    availableCopies: { type: Number, default: 1 },
    location: { type: String, default: "Main Library", trim: true },
    status: { type: String, default: "Available", enum: ["Available", "Checked Out", "Reserved"] }
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
