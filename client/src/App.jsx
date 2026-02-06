import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

const defaultBook = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  publishYear: "",
  availableCopies: 1,
  location: "Main Library",
  status: "Available"
};

const sampleBooks = [
  {
    _id: "1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "9780262033848",
    category: "Computer Science",
    publishYear: 2009,
    availableCopies: 4,
    location: "Engineering Library",
    status: "Available"
  },
  {
    _id: "2",
    title: "The History of the Ancient World",
    author: "Susan Wise Bauer",
    isbn: "9780393059748",
    category: "History",
    publishYear: 2007,
    availableCopies: 0,
    location: "Humanities Library",
    status: "Checked Out"
  },
  {
    _id: "3",
    title: "Principles of Microeconomics",
    author: "N. Gregory Mankiw",
    isbn: "9781305971493",
    category: "Economics",
    publishYear: 2019,
    availableCopies: 2,
    location: "Business Library",
    status: "Reserved"
  }
];

export default function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState(defaultBook);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBooks = async (query = "") => {
    setLoading(true);
    try {
      const response = await api.get("/books", {
        params: query ? { search: query } : {}
      });
      setBooks(response.data);
      setErrorMessage("");
    } catch (error) {
      setBooks(sampleBooks);
      setErrorMessage("Unable to load books. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "availableCopies" ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setFormData(defaultBook);
    setSelectedId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (selectedId) {
        await api.put(`/books/${selectedId}`, {
          ...formData,
          publishYear: Number(formData.publishYear)
        });
      } else {
        await api.post("/books", {
          ...formData,
          publishYear: Number(formData.publishYear)
        });
      }
      await loadBooks(search);
      resetForm();
    } catch (error) {
      setErrorMessage("Unable to save book. Verify required fields and ISBN.");
    }
  };

  const handleEdit = (book) => {
    setSelectedId(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publishYear: book.publishYear,
      availableCopies: book.availableCopies,
      location: book.location,
      status: book.status
    });
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Remove this book from the catalog?")) {
      return;
    }
    await api.delete(`/books/${bookId}`);
    await loadBooks(search);
  };

  const stats = useMemo(() => {
    const total = books.length;
    const available = books.filter((book) => book.status === "Available").length;
    const checkedOut = books.filter((book) => book.status === "Checked Out").length;
    return { total, available, checkedOut };
  }, [books]);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">University Library Management</p>
          <h1>Book Catalog Dashboard</h1>
          <p className="subtitle">
            Track titles, availability, and locations across your university library system.
          </p>
        </div>
        <div className="hero-cards">
          <div className="hero-card">
            <span>Total Titles</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="hero-card">
            <span>Available</span>
            <strong>{stats.available}</strong>
          </div>
          <div className="hero-card">
            <span>Checked Out</span>
            <strong>{stats.checkedOut}</strong>
          </div>
        </div>
      </header>

      <section className="content">
        <div className="panel">
          <h2>{selectedId ? "Edit Book" : "Add New Book"}</h2>
          <form onSubmit={handleSubmit} className="book-form">
            <label>
              Title
              <input name="title" value={formData.title} onChange={handleChange} required />
            </label>
            <label>
              Author
              <input name="author" value={formData.author} onChange={handleChange} required />
            </label>
            <label>
              ISBN
              <input name="isbn" value={formData.isbn} onChange={handleChange} required />
            </label>
            <label>
              Category
              <input name="category" value={formData.category} onChange={handleChange} required />
            </label>
            <label>
              Publish Year
              <input
                name="publishYear"
                type="number"
                value={formData.publishYear}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Available Copies
              <input
                name="availableCopies"
                type="number"
                min="0"
                value={formData.availableCopies}
                onChange={handleChange}
              />
            </label>
            <label>
              Location
              <input name="location" value={formData.location} onChange={handleChange} />
            </label>
            <label>
              Status
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Available">Available</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Reserved">Reserved</option>
              </select>
            </label>
            <div className="form-actions">
              <button type="submit" className="primary">
                {selectedId ? "Save Changes" : "Add Book"}
              </button>
              {selectedId ? (
                <button type="button" onClick={resetForm} className="ghost">
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
          {errorMessage ? <p className="error">{errorMessage}</p> : null}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Catalog</h2>
            <div className="search">
              <input
                placeholder="Search by title, author, or ISBN"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button onClick={() => loadBooks(search)} className="ghost">
                Search
              </button>
            </div>
          </div>
          {loading ? (
            <p className="muted">Loading books...</p>
          ) : (
            <div className="table">
              <div className="table-row table-header">
                <span>Title</span>
                <span>Author</span>
                <span>ISBN</span>
                <span>Category</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {books.map((book) => (
                <div className="table-row" key={book._id}>
                  <span>
                    <strong>{book.title}</strong>
                    <small>{book.location}</small>
                  </span>
                  <span>{book.author}</span>
                  <span>{book.isbn}</span>
                  <span>{book.category}</span>
                  <span>
                    <span className={`badge status-${book.status.replace(" ", "-").toLowerCase()}`}>
                      {book.status}
                    </span>
                  </span>
                  <span className="actions">
                    <button onClick={() => handleEdit(book)} className="ghost">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(book._id)} className="danger">
                      Delete
                    </button>
                  </span>
                </div>
              ))}
              {!books.length ? <p className="muted">No books yet. Add one to get started.</p> : null}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
