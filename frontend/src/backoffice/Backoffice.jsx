import { useAuth } from "../context/AuthContext.jsx";
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

export default function Backoffice({ page, selectedItem, onNavigate }) {
  const { authUser } = useAuth();

  if (authUser?.cargo !== 1 && authUser?.cargo !== 2) {
    return <div style={{ padding: 20 }}>Acesso negado. Apenas administradores podem aceder a esta secção.</div>;
  }

  return (
    <div style={{ padding: 20, height: "100%" }}>
      {page === "dashboard" && <Dashboard />}
      {page === "empresas" && <Empresas onNavigate={onNavigate} />}
      {page === "add-empresa" && <EmpresasForm onNavigate={onNavigate} />}
      {page === "edit-empresa" && <EmpresasForm empresa={selectedItem} onNavigate={onNavigate} />}
      {page === "delete-empresa" && <DeleteEmpresa empresa={selectedItem} onNavigate={onNavigate} />}
      {page === "utilizadores" && <Utilizadores onNavigate={onNavigate} />}
      {page === "add-utilizador" && <UtilizadorForm onNavigate={onNavigate} />}
      {page === "edit-utilizador" && <UtilizadorForm utilizador={selectedItem} onNavigate={onNavigate} />}
      {page === "delete-utilizador" && <DeleteUtilizador utilizador={selectedItem} onNavigate={onNavigate} />}
      {page === "ecopontos" && <Ecopontos onNavigate={onNavigate} />}
      {page === "add-ecoponto" && <EcopontoForm onNavigate={onNavigate} />}
      {page === "edit-ecoponto" && <EcopontoForm ecoponto={selectedItem} onNavigate={onNavigate} />}
      {page === "delete-ecoponto" && <DeleteEcoponto ecoponto={selectedItem} onNavigate={onNavigate} />}
      {page === "equipamentos" && <Equipamentos onNavigate={onNavigate} />}
      {page === "add-equipamento" && <EquipamentoForm onNavigate={onNavigate} />}
      {page === "edit-equipamento" && <EquipamentoForm equipamento={selectedItem} onNavigate={onNavigate} />}
      {page === "delete-equipamento" && <DeleteEquipamento equipamento={selectedItem} onNavigate={onNavigate} />}
      {page === "depositos" && <Depositos onNavigate={onNavigate} />}
      {page === "add-deposito" && <DepositoForm onNavigate={onNavigate} />}
      {page === "edit-deposito" && <DepositoForm deposito={selectedItem} onNavigate={onNavigate} />}
      {page === "delete-deposito" && <DeleteDeposito deposito={selectedItem} onNavigate={onNavigate} />}
      {page === "tipodepositos" && <TipoDepositos onNavigate={onNavigate} />}
      {page === "add-tipodeposito" && <TipoDepositoForm onNavigate={onNavigate} />}
      {page === "edit-tipodeposito" && <TipoDepositoForm tipoDeposito={selectedItem} onNavigate={onNavigate} />}
      {page === "delete-tipodeposito" && <DeleteTipoDeposito tipoDeposito={selectedItem} onNavigate={onNavigate} />}
      {page === "tipoecopontos" && <TipoEcopontos onNavigate={onNavigate} />}
      {page === "add-tipoecoponto" && <TipoEcopontoForm onNavigate={onNavigate} />}
      {page === "edit-tipoecoponto" && <TipoEcopontoForm tipoEcoponto={selectedItem} onNavigate={onNavigate} />}
      {page === "delete-tipoecoponto" && <DeleteTipoEcoponto tipoEcoponto={selectedItem} onNavigate={onNavigate} />}
      {page === "ecopontoequipamentos" && <EcopontoEquipamentos onNavigate={onNavigate} />}
      {page === "add-ecopontoequipamento" && <EcopontoEquipamentoForm onNavigate={onNavigate} />}
      {page === "edit-ecopontoequipamento" && <EcopontoEquipamentoForm ecopontoEquipamento={selectedItem} onNavigate={onNavigate} />}
      {page === "delete-ecopontoequipamento" && <DeleteEcopontoEquipamento ecopontoEquipamento={selectedItem} onNavigate={onNavigate} />}
    </div>
  );
}
