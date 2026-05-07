const pool = require("./db");
const fs = require("fs");
const path = require("path");

async function runSQL() {
  const sqlPath = path.join(__dirname, "../dist/queries_combinadas.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  await pool.query(sql);

  console.log("SQL executado!");
}

runSQL();