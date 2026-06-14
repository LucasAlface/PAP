import { useMemo, useState } from "react";
import Select from "react-select";
import useUtilizadores from "./useUtilizadores.js";
import useEmpresas from "../Empresa/useEmpresas.js";
import useCargos from "./useCargos.js";
import ListTemplate from "../ListTemplate.jsx";

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 6,
    borderColor: "#d1d5db",
    minHeight: 30
  })
};

export default function Utilizadores({ onNavigate }) {
  const { items: utilizadores, loading, error, refetch } = useUtilizadores();
  const { items: empresas } = useEmpresas();
  const { items: cargos } = useCargos();
  const [filters, setFilters] = useState({
    nome: "",
    email: "",
    cargoId: null,
    empresaId: null
  });

  const cargoById = useMemo(
    () => new Map(cargos.map((cargo) => [cargo.id, cargo.cargo || cargo.nome || cargo.id])),
    [cargos]
  );

  const empresaById = useMemo(
    () => new Map(empresas.map((empresa) => [empresa.id, empresa.nome || empresa.id])),
    [empresas]
  );

  const cargoOptions = useMemo(
    () => cargos.map((cargo) => ({
      value: String(cargo.id),
      label: cargo.cargo || cargo.nome || String(cargo.id)
    })),
    [cargos]
  );

  const empresaOptions = useMemo(
    () => empresas.map((empresa) => ({
      value: String(empresa.id),
      label: empresa.nome || String(empresa.id)
    })),
    [empresas]
  );

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    refetch({
      nome: filters.nome,
      email: filters.email,
      cargoId: filters.cargoId?.value || null,
      empresaId: filters.empresaId?.value || null
    });
  };

  const handleClearFilters = () => {
    setFilters({
      nome: "",
      email: "",
      cargoId: null,
      empresaId: null
    });
    refetch(null);
  };

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
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      filterSection={
        <>
          <div>
            <label>Nome</label>
            <input
              value={filters.nome}
              onChange={(event) => handleFilterChange("nome", event.target.value)}
              placeholder="Nome"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              value={filters.email}
              onChange={(event) => handleFilterChange("email", event.target.value)}
              placeholder="Email"
            />
          </div>
          <div>
            <label>Cargo</label>
            <Select
              options={cargoOptions}
              value={filters.cargoId}
              onChange={(option) => handleFilterChange("cargoId", option)}
              placeholder="Cargo"
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </div>
          <div>
            <label>Empresa</label>
            <Select
              options={empresaOptions}
              value={filters.empresaId}
              onChange={(option) => handleFilterChange("empresaId", option)}
              placeholder="Empresa"
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </div>
        </>
      }
    />
  );
}
