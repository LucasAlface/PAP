import { useMemo } from "react";
import useUtilizadores from "./useUtilizadores.js";
import useEmpresas from "../Empresa/useEmpresas.js";
import useCargos from "./useCargos.js";
import ListTemplate from "../ListTemplate.jsx";

export default function Utilizadores({ onNavigate }) {
  const { items: utilizadores, loading, error, refetch } = useUtilizadores();
  const { items: empresas } = useEmpresas();
  const { items: cargos } = useCargos();

  const cargoById = useMemo(
    () => new Map(cargos.map((cargo) => [cargo.id, cargo.nome || cargo.id])),
    [cargos]
  );

  const empresaById = useMemo(
    () => new Map(empresas.map((empresa) => [empresa.id, empresa.nome || empresa.id])),
    [empresas]
  );

  const columns = [
    { key: "nome", label: "Nome" },
    { key: "email", label: "Email" },
    {
      key: "cargoId",
      label: "Cargo",
      render: (item) => cargoById.get(item.cargoId) || item.cargoId
    },
    {
      key: "empresaId",
      label: "Empresa",
      render: (item) => empresaById.get(item.empresaId) || item.empresaId || "-"
    },
  ];

  return (
    <ListTemplate
      title="Utilizadores"
      addLabel="Add Utilizador"
      onAdd={() => onNavigate("add-utilizador")}
      loading={loading}
      error={error}
      items={utilizadores}
      totalLabel="Total de utilizadores"
      emptyMessage="No utilizadores found."
      columns={columns}
      getRowKey={(item) => item.id}
      onEdit={(item) => onNavigate("edit-utilizador", item)}
      onDelete={(item) => onNavigate("delete-utilizador", item)}
    />
  );
}
