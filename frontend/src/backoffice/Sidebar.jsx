import { useAuth } from "../context/AuthContext.jsx";
import {
  Map,
  Cylinder,
  Building2,
  Cpu,
  Database,
  FileClock,
  LayoutDashboard,
  Recycle,
  Tags,
  Users
} from "lucide-react";

const pageGroups = {
  dashboard: ["dashboard"],
  map: ["map"],
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
  ecopontologs: ["ecopontologs"],
  empresas: ["empresas", "add-empresa", "edit-empresa", "delete-empresa"],
  utilizadores: ["utilizadores", "add-utilizador", "edit-utilizador", "delete-utilizador"],
};

function RecycleCpuIcon({ size = 18 }) {
  return (
    <span
      className="combined-sidebar-icon"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Recycle size={size} strokeWidth={2.2} />
      <Cpu size={Math.max(10, Math.round(size * 0.58))} strokeWidth={2.4} />
    </span>
  );
}

const navItems = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "map", label: "Mapa", icon: Map },
  { page: "tipoecopontos", label: "Tipo Ecopontos", icon: Tags, adminOnly: true },
  { page: "tipodepositos", label: "Tipo Depósitos", icon: Database, adminOnly: true },
  { page: "empresas", label: "Empresas", icon: Building2, adminOnly: true },
  { page: "depositos", label: "Depósitos", icon: Cylinder },
  { page: "ecopontos", label: "Ecopontos", icon: Recycle },
  { page: "equipamentos", label: "Equipamentos", icon: Cpu },
  { page: "ecopontoequipamentos", label: "Ecoponto Equip.", icon: RecycleCpuIcon },
  { page: "ecopontologs", label: "Logs Ecopontos", icon: FileClock },
  { page: "utilizadores", label: "Utilizadores", icon: Users },
];

export default function Sidebar({ page, onNavigate, isOpen = false, onClose }) {
  const { authUser } = useAuth();
  const isAdmin = authUser?.cargo === 1;
  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className={`sidebar ${isOpen ? "is-mobile-open" : ""}`}>

      <nav className="sidebar-nav" aria-label="Backoffice">
        {visibleItems.map(({ page: itemPage, label, icon: Icon }) => {
          const active = pageGroups[itemPage]?.includes(page);

          return (
            <button
              key={itemPage}
              type="button"
              className={`sidebar-link ${active ? "is-active" : ""}`}
              onClick={() => {
                onNavigate(itemPage);
                onClose?.();
              }}
              title={label}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
