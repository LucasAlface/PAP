import { useAuth } from "../context/AuthContext.jsx";
import {
  Archive,
  Building2,
  Cpu,
  Database,
  LayoutDashboard,
  Leaf,
  Link2,
  Recycle,
  ShieldCheck,
  Tags,
  Users
} from "lucide-react";

const pageGroups = {
  dashboard: ["dashboard"],
  ecopontos: ["ecopontos", "add-ecoponto", "edit-ecoponto", "delete-ecoponto"],
  equipamentos: ["equipamentos", "add-equipamento", "edit-equipamento", "delete-equipamento"],
  depositos: ["depositos", "add-deposito", "edit-deposito", "delete-deposito"],
  tipoecopontos: ["tipoecopontos", "add-tipoecoponto", "edit-tipoecoponto", "delete-tipoecoponto"],
  tipodepositos: ["tipodepositos", "add-tipodeposito", "edit-tipodeposito", "delete-tipodeposito"],
  ecopontoequipamentos: [
    "ecopontoequipamentos",
    "add-ecopontoequipamento",
    "edit-ecopontoequipamento",
    "delete-ecopontoequipamento",
  ],
  empresas: ["empresas", "add-empresa", "edit-empresa", "delete-empresa"],
  utilizadores: ["utilizadores", "add-utilizador", "edit-utilizador", "delete-utilizador"],
};

const navItems = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "ecopontos", label: "Ecopontos", icon: Recycle },
  { page: "equipamentos", label: "Equipamentos", icon: Cpu },
  { page: "depositos", label: "Depósitos", icon: Archive },
  { page: "tipoecopontos", label: "Tipo Ecopontos", icon: Tags },
  { page: "tipodepositos", label: "Tipo Depósitos", icon: Database },
  { page: "ecopontoequipamentos", label: "Ecoponto Equip.", icon: Link2 },
  { page: "empresas", label: "Empresas", icon: Building2, adminOnly: true },
  { page: "utilizadores", label: "Utilizadores", icon: Users },
];

export default function Sidebar({ page, onNavigate }) {
  const { authUser } = useAuth();
  const isAdmin = authUser?.cargo === 1;
  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Leaf size={19} />
        </div>
        <div>
          <strong>Backoffice</strong>
          <span>Gestão operacional</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Backoffice">
        {visibleItems.map(({ page: itemPage, label, icon: Icon }) => {
          const active = pageGroups[itemPage]?.includes(page);

          return (
            <button
              key={itemPage}
              type="button"
              className={`sidebar-link ${active ? "is-active" : ""}`}
              onClick={() => onNavigate(itemPage)}
              title={label}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          <ShieldCheck size={18} />
        </div>
        <div>
          <strong>{authUser?.nome ?? "Administrador"}</strong>
          <span>{isAdmin ? "Super Admin" : "Administrador"}</span>
        </div>
      </div>
    </aside>
  );
}
