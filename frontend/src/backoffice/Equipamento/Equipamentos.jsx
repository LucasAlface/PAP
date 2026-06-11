import { useState, useMemo } from "react";
import Select from "react-select";
import useEquipamentos from "./useEquipamentos.js";
import { getOperatorOptions } from "../../middleware/options";
import ListTemplate from "../ListTemplate.jsx";

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 6,
    borderColor: "#d1d5db",
    minHeight: 38
  })
};

export default function Equipamentos({ onNavigate }) {
  const { items: equipamentos, loading, error, refetch } = useEquipamentos();

  const [filters, setFilters] = useState({
    codigo: null,
    ativo: null,
    bateria: "",
    operadorBateria: "igual"
  });

  const operators = getOperatorOptions();

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
      bateria: filters.bateria,
      operadorBateria: filters.operadorBateria
    };
    refetch(filterValues);
  };

  const handleClearFilters = () => {
    setFilters({
      codigo: null,
      ativo: null,
      bateria: "",
      operadorBateria: "igual"
    });
    refetch(null);
  };

  const columns = [
    { key: "codigo", label: "Código" },
    {
      key: "bateria",
      label: "Bateria",
      render: (item) => `${item.bateria}%`
    },
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
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Código</label>
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
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Status</label>
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

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Bateria</label>
            <div style={{ display: "flex", gap: 8 }}>
              <Select
                options={operators}
                value={filters.operadorBateria}
                onChange={(option) => handleFilterChange("operadorBateria", option)}
                placeholder="Selecionar operador"
                isClearable
                styles={selectStyles}
              />
              <input
                type="number"
                value={filters.bateria}
                onChange={(e) => handleFilterChange("bateria", e.target.value)}
                placeholder="Valor"
                style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db" }}
              />
            </div>
          </div>
        </>
      }
    />
  );
}
