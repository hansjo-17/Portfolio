const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });
const db = require("./db");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)";
  const values = [name, email, subject, message];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error saving contact message:", err.message);
      return res.status(500).json({ message: "Failed to save message" });
    }

    res.status(201).json({ message: "Message saved successfully" });
  });
});
app.get("/api/contacts", (req, res) => {
  const sql = "SELECT * FROM contacts ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching contacts:", err.message);
      return res.status(500).json({ message: "Failed to fetch contacts" });
    }

    res.status(200).json(results);
  });
});
app.delete("/api/contacts/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM contacts WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting contact:", err.message);
      return res.status(500).json({ message: "Failed to delete contact" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  });
});
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const sql = "SELECT * FROM admins WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error during admin login:", err.message);
      return res.status(500).json({ message: "Login failed" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});