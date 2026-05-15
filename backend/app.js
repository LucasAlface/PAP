const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const PORT = process.env.PORT || 3000;
const { inserirDados } = require("./script");
const {
  tipo_ecoponto_router,
  tipo_deposito_router,
  deposito_router,
  ecoponto_router,
  equipamento_router,
  ecoponto_equipamento_router,
  rotas_router
} = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(cors());


app.get("/", async (req, res) => {
  try {
    res.json("online");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.use("/tipoecoponto", tipo_ecoponto_router);
app.use("/tipodeposito", tipo_deposito_router);
app.use("/deposito", deposito_router);
app.use("/ecoponto", ecoponto_router);
app.use("/equipamento", equipamento_router);
app.use("/ecopontoequipamento", ecoponto_equipamento_router);
app.use("/rotas", rotas_router);

app.listen(PORT, () => {
  console.log("Servidor online");
});