const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3030;

app.use(express.json());

// Create a MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "search_map"
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("Connected to the database.");
});

// Define the API endpoint to get markers
app.post("/markers", (req, res) => {
  const { inputString } = req.body;

  if (!inputString) {
    return res.status(400).json({ error: "Input string is required." });
  }

  // Adjust the query based on your table structure
  const query = "SELECT * FROM markers WHERE name LIKE ? OR descreption LIKE ? OR category LIKE ?;";
  const queryParams = [
    `%${inputString}%`,
    `%${inputString}%`,
    `%${inputString}%`
  ];

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching markers from the database:", err);
      return res.status(500).json({ error: "Failed to fetch markers." });
    }

    res.json({ results });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
