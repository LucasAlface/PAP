import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Dashboard from "./Dashboard.jsx";
import Users from "./Users.jsx";
import Ecopontos from "./Ecoponto/Ecopontos.jsx";
import AddEcoponto from "./Ecoponto/Add.jsx";
import EditEcoponto from "./Ecoponto/Edit.jsx";
import DeleteEcoponto from "./Ecoponto/Delete.jsx";
import Equipamentos from "./Equipamento/Equipamentos.jsx";
import AddEquipamento from "./Equipamento/Add.jsx";
import EditEquipamento from "./Equipamento/Edit.jsx";
import DeleteEquipamento from "./Equipamento/Delete.jsx";
import Depositos from "./Deposito/Depositos.jsx";
import AddDeposito from "./Deposito/Add.jsx";
import EditDeposito from "./Deposito/Edit.jsx";
import DeleteDeposito from "./Deposito/Delete.jsx";
import TipoDepositos from "./TipoDeposito/TipoDepositos.jsx";
import AddTipoDeposito from "./TipoDeposito/Add.jsx";
import EditTipoDeposito from "./TipoDeposito/Edit.jsx";
import DeleteTipoDeposito from "./TipoDeposito/Delete.jsx";
import TipoEcopontos from "./TipoEcoponto/TipoEcopontos.jsx";
import AddTipoEcoponto from "./TipoEcoponto/Add.jsx";
import EditTipoEcoponto from "./TipoEcoponto/Edit.jsx";
import DeleteTipoEcoponto from "./TipoEcoponto/Delete.jsx";
import EcopontoEquipamentos from "./EcopontoEquipamento/EcopontoEquipamentos.jsx";
import AddEcopontoEquipamento from "./EcopontoEquipamento/Add.jsx";
import EditEcopontoEquipamento from "./EcopontoEquipamento/Edit.jsx";
import DeleteEcopontoEquipamento from "./EcopontoEquipamento/Delete.jsx";

export default function Backoffice() {
  const [page, setPage] = useState("dashboard");
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = (newPage, item = null) => {
    setSelectedItem(item);
    setPage(newPage);
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar page={page} onNavigate={navigate} />

      <div style={{ flex: 1, padding: 20, overflow: "auto" }}>
        {page === "dashboard" && <Dashboard />}
        {page === "users" && <Users />}
        {page === "ecopontos" && <Ecopontos onNavigate={navigate} />}
        {page === "add-ecoponto" && <AddEcoponto />}
        {page === "edit-ecoponto" && <EditEcoponto ecoponto={selectedItem} onNavigate={navigate} />}
        {page === "delete-ecoponto" && <DeleteEcoponto ecoponto={selectedItem} onNavigate={navigate} />}
        {page === "equipamentos" && <Equipamentos onNavigate={navigate} />}
        {page === "add-equipamento" && <AddEquipamento />}
        {page === "edit-equipamento" && <EditEquipamento equipamento={selectedItem} onNavigate={navigate} />}
        {page === "delete-equipamento" && <DeleteEquipamento equipamento={selectedItem} onNavigate={navigate} />}
        {page === "depositos" && <Depositos onNavigate={navigate} />}
        {page === "add-deposito" && <AddDeposito />}
        {page === "edit-deposito" && <EditDeposito deposito={selectedItem} onNavigate={navigate} />}
        {page === "delete-deposito" && <DeleteDeposito deposito={selectedItem} onNavigate={navigate} />}
        {page === "tipodepositos" && <TipoDepositos onNavigate={navigate} />}
        {page === "add-tipodeposito" && <AddTipoDeposito />}
        {page === "edit-tipodeposito" && <EditTipoDeposito tipoDeposito={selectedItem} onNavigate={navigate} />}
        {page === "delete-tipodeposito" && <DeleteTipoDeposito tipoDeposito={selectedItem} onNavigate={navigate} />}
        {page === "tipoecopontos" && <TipoEcopontos onNavigate={navigate} />}
        {page === "add-tipoecoponto" && <AddTipoEcoponto />}
        {page === "edit-tipoecoponto" && <EditTipoEcoponto tipoEcoponto={selectedItem} onNavigate={navigate} />}
        {page === "delete-tipoecoponto" && <DeleteTipoEcoponto tipoEcoponto={selectedItem} onNavigate={navigate} />}
        {page === "ecopontoequipamentos" && <EcopontoEquipamentos onNavigate={navigate} />}
        {page === "add-ecopontoequipamento" && <AddEcopontoEquipamento />}
        {page === "edit-ecopontoequipamento" && <EditEcopontoEquipamento ecopontoEquipamento={selectedItem} onNavigate={navigate} />}
        {page === "delete-ecopontoequipamento" && <DeleteEcopontoEquipamento ecopontoEquipamento={selectedItem} onNavigate={navigate} />}
      </div>
    </div>
  );
}
