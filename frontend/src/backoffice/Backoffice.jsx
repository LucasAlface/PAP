import { useAuth } from "../context/AuthContext.jsx";
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

const sections = [
  {
    base: "ecopontos",
    add: "add-ecoponto",
    edit: "edit-ecoponto",
    delete: "delete-ecoponto",
    List: Ecopontos,
    renderAdd: (onNavigate, ecopontoMapCoordinates) => (
      <EcopontoForm onNavigate={onNavigate} mapCoordinates={ecopontoMapCoordinates} />
    ),
    renderEdit: (selectedItem, onNavigate, ecopontoMapCoordinates) => (
      <EcopontoForm ecoponto={selectedItem} onNavigate={onNavigate} mapCoordinates={ecopontoMapCoordinates} />
    ),
    renderDelete: (selectedItem, onNavigate) => <DeleteEcoponto ecoponto={selectedItem} onNavigate={onNavigate} />,
  },
  {
    base: "equipamentos",
    add: "add-equipamento",
    edit: "edit-equipamento",
    delete: "delete-equipamento",
    List: Equipamentos,
    renderAdd: (onNavigate) => <EquipamentoForm onNavigate={onNavigate} />,
    renderEdit: (selectedItem, onNavigate) => <EquipamentoForm equipamento={selectedItem} onNavigate={onNavigate} />,
    renderDelete: (selectedItem, onNavigate) => <DeleteEquipamento equipamento={selectedItem} onNavigate={onNavigate} />,
  },
  {
    base: "depositos",
    add: "add-deposito",
    edit: "edit-deposito",
    delete: "delete-deposito",
    List: Depositos,
    renderAdd: (onNavigate) => <DepositoForm onNavigate={onNavigate} />,
    renderEdit: (selectedItem, onNavigate) => <DepositoForm deposito={selectedItem} onNavigate={onNavigate} />,
    renderDelete: (selectedItem, onNavigate) => <DeleteDeposito deposito={selectedItem} onNavigate={onNavigate} />,
  },
  {
    base: "tipodepositos",
    add: "add-tipodeposito",
    edit: "edit-tipodeposito",
    delete: "delete-tipodeposito",
    List: TipoDepositos,
    renderAdd: (onNavigate) => <TipoDepositoForm onNavigate={onNavigate} />,
    renderEdit: (selectedItem, onNavigate) => <TipoDepositoForm tipoDeposito={selectedItem} onNavigate={onNavigate} />,
    renderDelete: (selectedItem, onNavigate) => <DeleteTipoDeposito tipoDeposito={selectedItem} onNavigate={onNavigate} />,
  },
  {
    base: "tipoecopontos",
    add: "add-tipoecoponto",
    edit: "edit-tipoecoponto",
    delete: "delete-tipoecoponto",
    List: TipoEcopontos,
    renderAdd: (onNavigate) => <TipoEcopontoForm onNavigate={onNavigate} />,
    renderEdit: (selectedItem, onNavigate) => <TipoEcopontoForm tipoEcoponto={selectedItem} onNavigate={onNavigate} />,
    renderDelete: (selectedItem, onNavigate) => <DeleteTipoEcoponto tipoEcoponto={selectedItem} onNavigate={onNavigate} />,
  },
  {
    base: "ecopontoequipamentos",
    add: "add-ecopontoequipamento",
    edit: "edit-ecopontoequipamento",
    delete: "delete-ecopontoequipamento",
    List: EcopontoEquipamentos,
    renderAdd: (onNavigate) => <EcopontoEquipamentoForm onNavigate={onNavigate} />,
    renderEdit: (selectedItem, onNavigate) => (
      <EcopontoEquipamentoForm ecopontoEquipamento={selectedItem} onNavigate={onNavigate} />
    ),
    renderDelete: (selectedItem, onNavigate) => (
      <DeleteEcopontoEquipamento ecopontoEquipamento={selectedItem} onNavigate={onNavigate} />
    ),
  },
  {
    base: "empresas",
    add: "add-empresa",
    edit: "edit-empresa",
    delete: "delete-empresa",
    List: Empresas,
    renderAdd: (onNavigate, _ecopontoMapCoordinates, empresaMapCoordinates) => (
      <EmpresasForm onNavigate={onNavigate} mapCoordinates={empresaMapCoordinates} />
    ),
    renderEdit: (selectedItem, onNavigate, _ecopontoMapCoordinates, empresaMapCoordinates) => (
      <EmpresasForm empresa={selectedItem} onNavigate={onNavigate} mapCoordinates={empresaMapCoordinates} />
    ),
    renderDelete: (selectedItem, onNavigate) => <DeleteEmpresa empresa={selectedItem} onNavigate={onNavigate} />,
  },
  {
    base: "utilizadores",
    add: "add-utilizador",
    edit: "edit-utilizador",
    delete: "delete-utilizador",
    List: Utilizadores,
    renderAdd: (onNavigate) => <UtilizadorForm onNavigate={onNavigate} />,
    renderEdit: (selectedItem, onNavigate) => <UtilizadorForm utilizador={selectedItem} onNavigate={onNavigate} />,
    renderDelete: (selectedItem, onNavigate) => <DeleteUtilizador utilizador={selectedItem} onNavigate={onNavigate} />,
  },
];

function getSection(page) {
  return sections.find((section) =>
    [section.base, section.add, section.edit, section.delete].includes(page)
  );
}

export default function Backoffice({ page, selectedItem, onNavigate, ecopontoMapCoordinates, empresaMapCoordinates }) {
  const { authUser } = useAuth();

  if (authUser?.cargo !== 1 && authUser?.cargo !== 2) {
    return <div className="backoffice-access-denied">Acesso negado. Apenas administradores podem aceder a esta secção.</div>;
  }

  const section = getSection(page) || sections[0];
  const List = section.List;
  const action =
    page === section.edit
      ? section.renderEdit(selectedItem, onNavigate, ecopontoMapCoordinates, empresaMapCoordinates)
      : page === section.delete
        ? section.renderDelete(selectedItem, onNavigate)
        : section.renderAdd(onNavigate, ecopontoMapCoordinates, empresaMapCoordinates);

  return (
    <div className="backoffice backoffice-grid">
      <section className="backoffice-list-pane">
        <List onNavigate={onNavigate} />
      </section>
      <aside className="backoffice-action-pane" key={`${page}-${selectedItem?.id ?? selectedItem?.codigo ?? ""}`}>
        {action}
      </aside>
    </div>
  );
}
