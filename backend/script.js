const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const pool = require("./db");
const fs = require("fs");

async function runSQL() {
  const sqlPath = path.join(__dirname, "../dist/queries_combinadas.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  await pool.query(sql);

  console.log("SQL executado!");
}

runSQL();