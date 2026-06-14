import { useState, useMemo } from "react";
import Select from "react-select";
import useTipoEcopontos from "./useTipoEcopontos.js";
import ListTemplate from "../ListTemplate.jsx";

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 6,
    borderColor: "#d1d5db",
    minHeight: 38
  })
};

export default function TipoEcopontos({ onNavigate }) {
  const { items: tipoEcopontos, loading, error, refetch } = useTipoEcopontos();

  const [filters, setFilters] = useState({
    tipo: null,
    descricao: ""
  });

  const tipoOptions = useMemo(() =>
    tipoEcopontos.map(t => ({ value: t.tipo, label: t.tipo })),
    [tipoEcopontos]
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
    { key: "tipo", label: "Tipo" },
    { key: "descricao", label: "Descrição" },
  ];

  return (
    <ListTemplate
      title="Tipo Ecopontos"
      addLabel="Add Tipo Ecoponto"
      onAdd={() => onNavigate("add-tipoecoponto")}
      loading={loading}
      error={error}
      items={tipoEcopontos}
      totalLabel="Total de tipo ecopontos"
      emptyMessage="No tipo ecopontos found."
      columns={columns}
      getRowKey={(item) => item.id}
      onEdit={(item) => onNavigate("edit-tipoecoponto", item)}
      onDelete={(item) => onNavigate("delete-tipoecoponto", item)}
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
