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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});