const mysql = require("mysql2");
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing!");
  process.exit(1);
}
const url = new URL(process.env.DATABASE_URL);

const db = mysql.createConnection({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.replace("/", ""),
  port: url.port
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;