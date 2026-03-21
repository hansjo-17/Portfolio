const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config;
//dotenv.config({ path: __dirname + "/.env" });//
const db = require("./db");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
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
app.post("/api/certificates", (req, res) => {
  const { title, issuer, file_name } = req.body;

  if (!title || !issuer || !file_name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO certificates (title, issuer, file_name) VALUES (?, ?, ?)";
  db.query(sql, [title, issuer, file_name], (err, result) => {
    if (err) {
      console.error("Error adding certificate:", err.message);
      return res.status(500).json({ message: "Failed to add certificate" });
    }

    res.status(201).json({ message: "Certificate added successfully" });
  });
});
app.get("/api/certificates", (req, res) => {
  const sql = "SELECT * FROM certificates ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching certificates:", err.message);
      return res.status(500).json({ message: "Failed to fetch certificates" });
    }

    res.status(200).json(results);
  });
});
app.delete("/api/certificates/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM certificates WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting certificate:", err.message);
      return res.status(500).json({ message: "Failed to delete certificate" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json({ message: "Certificate deleted successfully" });
  });
});
app.put("/api/certificates/:id", (req, res) => {
  const { id } = req.params;
  const { title, issuer, file_name } = req.body;

  if (!title || !issuer || !file_name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "UPDATE certificates SET title=?, issuer=?, file_name=? WHERE id=?";

  db.query(sql, [title, issuer, file_name, id], (err, result) => {
    if (err) {
      console.error("Error updating certificate:", err.message);
      return res.status(500).json({ message: "Failed to update certificate" });
    }

    res.status(200).json({ message: "Certificate updated successfully" });
  });
});
/*app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/
/*app.get("/", (req, res) => {
  res.send("Backend is running");
});*/
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});