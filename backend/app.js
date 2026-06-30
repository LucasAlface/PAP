const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const { inserirDados } = require("./script");
const sequelize = require("./db");
const {
  tipo_ecoponto_router,
  tipo_deposito_router,
  deposito_router,
  ecoponto_router,
  equipamento_router,
  ecoponto_equipamento_router,
  ecoponto_logs_router,
  rotas_router,
  utilizador_router,
  cargo_router,
  empresa_router,
  login_router
} = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
  ],
  credentials: true
}));


app.get("/", (req, res) => {
  res.json("online");
});

if (process.env.ENABLE_DB_SEED === "true") {
  app.post("/seed", async (req, res) => {
    try {
      await inserirDados();
      res.json("Dados inseridos com sucesso");
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  });
}


app.use("/tipoecoponto", tipo_ecoponto_router);
app.use("/tipodeposito", tipo_deposito_router);
app.use("/deposito", deposito_router);
app.use("/ecoponto", ecoponto_router);
app.use("/equipamento", equipamento_router);
app.use("/ecopontoequipamento", ecoponto_equipamento_router);
app.use("/ecopontologs", ecoponto_logs_router);
app.use("/rotas", rotas_router);
app.use("/utilizador", utilizador_router);
app.use("/cargo", cargo_router);
app.use("/empresa", empresa_router);
app.use("/login", login_router);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");
    app.listen(PORT, "0.0.0.0", () => {
      console.log("Servidor online");
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err.message || err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
