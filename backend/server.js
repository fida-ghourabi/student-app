require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise"); // version promise
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

async function initDB() {
  try {
    // Connexion au serveur MySQL sans choisir de DB
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });

    // Création de la base si elle n'existe pas
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log("Database exists or created ✅");

    // Connexion à la base
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    // Création de la table students si elle n'existe pas
    await db.query(`CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      level VARCHAR(50) NOT NULL
    );`);
    console.log("Table students ready ✅");

    return db;
  } catch (err) {
    console.error("Erreur MySQL :", err);
    process.exit(1);
  }
}

(async () => {
  const db = await initDB();

  // Routes
  app.get("/students", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM students");
    res.json(rows);
  });

  app.post("/students", async (req, res) => {
    const { name, email, level } = req.body;
    await db.query("INSERT INTO students (name,email,level) VALUES (?,?,?)", [name, email, level]);
    res.json({ message: "Ajouté" });
  });

  app.delete("/students/:id", async (req, res) => {
    await db.query("DELETE FROM students WHERE id=?", [req.params.id]);
    res.json({ message: "Supprimé" });
  });

  app.listen(process.env.PORT, () =>
    console.log(`Backend sur http://localhost:${process.env.PORT}`)
  );
})();
