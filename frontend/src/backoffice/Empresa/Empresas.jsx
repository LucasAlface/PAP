import { useState } from "react";
import useEmpresas from './useEmpresas.js';
import ListTemplate from "../ListTemplate.jsx";

export default function Empresas({ onNavigate }) {
  const { items: empresas, loading, error, refetch } = useEmpresas();
  const [filters, setFilters] = useState({
    nome: "",
    nif: "",
    email: "",
    telefone: ""
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    refetch(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      nome: "",
      nif: "",
      email: "",
      telefone: ""
    });
    refetch(null);
  };

  const columns = [
    { key: "nome", label: "Nome" },
    { key: "nif", label: "NIF" },
    { key: "email", label: "Email" },
    { key: "telefone", label: "Telefone" },
    { key: "latitude", label: "Latitude" },
    { key: "longitude", label: "Longitude" }
  ];

  return (
    <ListTemplate
      title="Empresas"
      addLabel="Add Empresa"
      onAdd={() => onNavigate("add-empresa")}
      loading={loading}
      error={error}
      items={empresas}
      totalLabel="Total de empresas"
      emptyMessage="No empresas found."
      columns={columns}
      getRowKey={(item) => item.id}
      onEdit={(item) => onNavigate("edit-empresa", item)}
      onDelete={(item) => onNavigate("delete-empresa", item)}
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
            <label>NIF</label>
            <input
              value={filters.nif}
              onChange={(event) => handleFilterChange("nif", event.target.value)}
              placeholder="NIF"
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
            <label>Telefone</label>
            <input
              value={filters.telefone}
              onChange={(event) => handleFilterChange("telefone", event.target.value)}
              placeholder="Telefone"
            />
          </div>
        </>
      }
    />
  );
}
