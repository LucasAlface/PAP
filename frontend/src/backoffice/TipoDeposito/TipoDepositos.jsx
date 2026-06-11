import { useState, useMemo } from "react";
import Select from "react-select";
import useTipoDepositos from "./useTipoDepositos.js";
import ListTemplate from "../ListTemplate.jsx";

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 6,
    borderColor: "#d1d5db",
    minHeight: 38
  })
};

export default function TipoDepositos({ onNavigate }) {
  const { items: tipoDepositos, loading, error, refetch } = useTipoDepositos();

  const [filters, setFilters] = useState({
    tipo: null,
    descricao: ""
  });

  const tipoOptions = useMemo(() =>
    tipoDepositos.map(t => ({ value: t.tipo, label: t.tipo })),
    [tipoDepositos]
  );

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    const filterValues = {
      tipo: filters.tipo?.value || null,
      descricao: filters.descricao
    };
    refetch(filterValues);
  };

  const handleClearFilters = () => {
    setFilters({
      tipo: null,
      descricao: ""
    });
    refetch(null);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "tipo", label: "Tipo" },
    { key: "descricao", label: "Descrição" },
  ];

  return (
    <ListTemplate
      title="Tipo Depósitos"
      addLabel="Add Tipo Depósito"
      onAdd={() => onNavigate("add-tipodeposito")}
      loading={loading}
      error={error}
      items={tipoDepositos}
      totalLabel="Total de tipo depósitos"
      emptyMessage="No tipo depósitos found."
      columns={columns}
      getRowKey={(item) => item.id}
      onEdit={(item) => onNavigate("edit-tipodeposito", item)}
      onDelete={(item) => onNavigate("delete-tipodeposito", item)}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      filterSection={
        <>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Tipo</label>
            <Select
              options={tipoOptions}
              value={filters.tipo}
              onChange={(option) => handleFilterChange("tipo", option)}
              placeholder="Pesquisar por tipo"
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Descrição</label>
            <input
              type="text"
              value={filters.descricao}
              onChange={(e) => handleFilterChange("descricao", e.target.value)}
              placeholder="Pesquisar por descrição"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box" }}
            />
          </div>
        </>
      }
    />
  );
}
