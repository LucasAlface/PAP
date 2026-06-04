import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "./Sidebar.jsx";
import Dashboard from "./Dashboard.jsx";
import Ecopontos from "./Ecoponto/Ecopontos.jsx";
import EcopontoForm from "./Ecoponto/EcopontoForm.jsx";
import DeleteEcoponto from "./Ecoponto/Delete.jsx";
import Equipamentos from "./Equipamento/Equipamentos.jsx";
import EquipamentoForm from "./Equipamento/EquipamentoForm.jsx";
import DeleteEquipamento from "./Equipamento/Delete.jsx";
import Depositos from "./Deposito/Depositos.jsx";
import DepositoForm from "./Deposito/DepositoForm.jsx";
import DeleteDeposito from "./Deposito/Delete.jsx";
import TipoDepositos from "./TipoDeposito/TipoDepositos.jsx";
import TipoDepositoForm from "./TipoDeposito/TipoDepositoForm.jsx";
import DeleteTipoDeposito from "./TipoDeposito/Delete.jsx";
import TipoEcopontos from "./TipoEcoponto/TipoEcopontos.jsx";
import TipoEcopontoForm from "./TipoEcoponto/TipoEcopontoForm.jsx";
import DeleteTipoEcoponto from "./TipoEcoponto/Delete.jsx";
import EcopontoEquipamentos from "./EcopontoEquipamento/EcopontoEquipamentos.jsx";
import EcopontoEquipamentoForm from "./EcopontoEquipamento/EcopontoEquipamentoForm.jsx";
import DeleteEcopontoEquipamento from "./EcopontoEquipamento/Delete.jsx";
import Empresas from "./Empresa/Empresas.jsx";
import EmpresasForm from "./Empresa/EmpresasForm.jsx";
import DeleteEmpresa from "./Empresa/Delete.jsx";
import Utilizadores from "./Utilizador/Utilizadores.jsx";
import UtilizadorForm from "./Utilizador/UtilizadorForm.jsx";
import DeleteUtilizador from "./Utilizador/Delete.jsx";

export default function Backoffice() {
  const [page, setPage] = useState("dashboard");
  const [selectedItem, setSelectedItem] = useState(null);
  const {authUser} = useAuth();

  const navigate = (newPage, item = null) => {
    setSelectedItem(item);
    setPage(newPage);
  };

  if (authUser?.cargo !== 1 && authUser?.cargo !== 2) {
    return <div style={{ padding: 20 }}>Acesso negado. Apenas administradores podem aceder a esta secção.</div>;
  }
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar page={page} onNavigate={navigate} />

      <div style={{ flex: 1, padding: 20, overflow: "auto" }}>
        {page === "dashboard" && <Dashboard />}
        {page === "empresas" && <Empresas onNavigate={navigate} />}
        {page === "add-empresa" && <EmpresasForm onNavigate={navigate} />}
        {page === "edit-empresa" && <EmpresasForm empresa={selectedItem} onNavigate={navigate} />}
        {page === "delete-empresa" && <DeleteEmpresa empresa={selectedItem} onNavigate={navigate} />}
        {page === "utilizadores" && <Utilizadores onNavigate={navigate} />}
        {page === "add-utilizador" && <UtilizadorForm onNavigate={navigate} />}
        {page === "edit-utilizador" && <UtilizadorForm utilizador={selectedItem} onNavigate={navigate} />}
        {page === "delete-utilizador" && <DeleteUtilizador utilizador={selectedItem} onNavigate={navigate} />}
        {page === "ecopontos" && <Ecopontos onNavigate={navigate} />}
        {page === "add-ecoponto" && <EcopontoForm onNavigate={navigate} />}
        {page === "edit-ecoponto" && <EcopontoForm ecoponto={selectedItem} onNavigate={navigate} />}
        {page === "delete-ecoponto" && <DeleteEcoponto ecoponto={selectedItem} onNavigate={navigate} />}
        {page === "equipamentos" && <Equipamentos onNavigate={navigate} />}
        {page === "add-equipamento" && <EquipamentoForm onNavigate={navigate} />}
        {page === "edit-equipamento" && <EquipamentoForm equipamento={selectedItem} onNavigate={navigate} />}
        {page === "delete-equipamento" && <DeleteEquipamento equipamento={selectedItem} onNavigate={navigate} />}
        {page === "depositos" && <Depositos onNavigate={navigate} />}
        {page === "add-deposito" && <DepositoForm onNavigate={navigate} />}
        {page === "edit-deposito" && <DepositoForm deposito={selectedItem} onNavigate={navigate} />}
        {page === "delete-deposito" && <DeleteDeposito deposito={selectedItem} onNavigate={navigate} />}
        {page === "tipodepositos" && <TipoDepositos onNavigate={navigate} />}
        {page === "add-tipodeposito" && <TipoDepositoForm onNavigate={navigate} />}
        {page === "edit-tipodeposito" && <TipoDepositoForm tipoDeposito={selectedItem} onNavigate={navigate} />}
        {page === "delete-tipodeposito" && <DeleteTipoDeposito tipoDeposito={selectedItem} onNavigate={navigate} />}
        {page === "tipoecopontos" && <TipoEcopontos onNavigate={navigate} />}
        {page === "add-tipoecoponto" && <TipoEcopontoForm onNavigate={navigate} />}
        {page === "edit-tipoecoponto" && <TipoEcopontoForm tipoEcoponto={selectedItem} onNavigate={navigate} />}
        {page === "delete-tipoecoponto" && <DeleteTipoEcoponto tipoEcoponto={selectedItem} onNavigate={navigate} />}
        {page === "ecopontoequipamentos" && <EcopontoEquipamentos onNavigate={navigate} />}
        {page === "add-ecopontoequipamento" && <EcopontoEquipamentoForm onNavigate={navigate} />}
        {page === "edit-ecopontoequipamento" && <EcopontoEquipamentoForm ecopontoEquipamento={selectedItem} onNavigate={navigate} />}
        {page === "delete-ecopontoequipamento" && <DeleteEcopontoEquipamento ecopontoEquipamento={selectedItem} onNavigate={navigate} />}
      </div>
    </div>
  );
}
