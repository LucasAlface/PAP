import { useState, useMemo } from "react";
import Select from "react-select";
import useEquipamentos from "./useEquipamentos.js";
import ListTemplate from "../ListTemplate.jsx";

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 6,
    borderColor: "#d1d5db",
    minHeight: 30
  })
};

export default function Equipamentos({ onNavigate }) {
  const { items: equipamentos, loading, error, refetch } = useEquipamentos();

  const [filters, setFilters] = useState({
    codigo: null,
    ativo: null,
  });

  const codigoOptions = useMemo(() =>
    equipamentos.map(e => ({ value: e.codigo, label: e.codigo })),
    [equipamentos]
  );

  const ativoOptions = [
    { value: "true", label: "Ativo" },
    { value: "false", label: "Inativo" }
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    const filterValues = {
      codigo: filters.codigo?.value || null,
      ativo: filters.ativo?.value || null,
    };
    refetch(filterValues);
  };

  const handleClearFilters = () => {
    setFilters({
      codigo: null,
      ativo: null,
    });
    refetch(null);
  };

  const columns = [
    { key: "codigo", label: "Código" },
    {
      key: "ativo",
      label: "Status",
      render: (item) => item.ativo ? "Ativo" : "Inativo"
    },
  ];

  return (
    <ListTemplate
      title="Equipamentos"
      addLabel="Add Equipamento"
      onAdd={() => onNavigate("add-equipamento")}
      loading={loading}
      error={error}
      items={equipamentos}
      totalLabel="Total de equipamentos"
      emptyMessage="No equipamentos found."
      columns={columns}
      getRowKey={(item) => item.id}
      onEdit={(item) => onNavigate("edit-equipamento", item)}
      onDelete={(item) => onNavigate("delete-equipamento", item)}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      filterSection={
        <>
          <div>
            <label>Código</label>
            <Select
              options={codigoOptions}
              value={filters.codigo}
              onChange={(option) => handleFilterChange("codigo", option)}
              placeholder="Selecionar código"
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </div>

          <div>
            <label>Status</label>
            <Select
              options={ativoOptions}
              value={filters.ativo}
              onChange={(option) => handleFilterChange("ativo", option)}
              placeholder="Todos"
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
