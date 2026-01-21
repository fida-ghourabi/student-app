require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
  console.error("Erreur MySQL :", err);
  return;
}

  console.log("MySQL connecté");
});

// Routes
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    res.json(result);
  });
});

app.post("/students", (req, res) => {
  const { name, email, level } = req.body;
  db.query(
    "INSERT INTO students (name,email,level) VALUES (?,?,?)",
    [name, email, level],
    () => res.json({ message: "Ajouté" })
  );
});

app.delete("/students/:id", (req, res) => {
  db.query(
    "DELETE FROM students WHERE id=?",
    [req.params.id],
    () => res.json({ message: "Supprimé" })
  );
});

app.listen(process.env.PORT, () =>
  console.log("Backend sur http://localhost:5000")
);
