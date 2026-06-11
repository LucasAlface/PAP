import { useState, useMemo } from "react";
import Select from "react-select";
import useEcopontoEquipamentos from "./useEcopontoEquipamentos.js";
import useEcopontos from "../Ecoponto/useEcopontos.js";
import useEquipamentos from "../Equipamento/useEquipamentos.js";
import ListTemplate from "../ListTemplate.jsx";

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 6,
    borderColor: "#d1d5db",
    minHeight: 38
  })
};

export default function EcopontoEquipamentos({ onNavigate }) {
  const { items, loading, error, refetch } = useEcopontoEquipamentos();
  const { items: ecopontos } = useEcopontos();
  const { items: equipamentos } = useEquipamentos();

  const [filters, setFilters] = useState({
    ecopontoId: null,
    equipamentoId: null,
    ativo: null
  });

  const ecopontoOptions = useMemo(() =>
    Array.isArray(ecopontos) ? ecopontos.map(e => ({ value: e.id, label: e.codigo })) : [],
    [ecopontos]
  );

  const equipamentoOptions = useMemo(() =>
    Array.isArray(equipamentos) ? equipamentos.map(eq => ({ value: eq.id, label: eq.codigo })) : [],
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
      ecopontoId: filters.ecopontoId?.value || null,
      equipamentoId: filters.equipamentoId?.value || null,
      ativo: filters.ativo?.value || null
    };
    refetch(filterValues);
  };

  const handleClearFilters = () => {
    setFilters({
      ecopontoId: null,
      equipamentoId: null,
      ativo: null
    });
    refetch(null);
  };

  const columns = [
    {
      key: "ecopontoId",
      label: "Ecoponto",
      render: (item) =>
        Array.isArray(ecopontos)
          ? ecopontos.find((e) => e.id === item.ecopontoId)?.codigo ?? "Ecoponto não encontrado"
          : "Loading..."
    },
    {
      key: "equipamentoId",
      label: "Equipamento",
      render: (item) =>
        Array.isArray(equipamentos)
          ? equipamentos.find((eq) => eq.id === item.equipamentoId)?.codigo ?? "Equipamento não encontrado"
          : "Loading..."
    },
    {
      key: "ativo",
      label: "Status",
      render: (item) => item.ativo ? "Ativo" : "Inativo"
    },
  ];

  return (
    <ListTemplate
      title="Ecoponto Equipamentos"
      addLabel="Add Ecoponto Equipamento"
      onAdd={() => onNavigate("add-ecopontoequipamento")}
      loading={loading}
      error={error}
      items={items}
      totalLabel="Total de ecoponto equipamentos"
      emptyMessage="No ecoponto equipamentos found."
      columns={columns}
      getRowKey={(item) => `${item.ecopontoId}-${item.equipamentoId}`}
      onEdit={(item) => onNavigate("edit-ecopontoequipamento", item)}
      onDelete={(item) => onNavigate("delete-ecopontoequipamento", item)}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      filterSection={
        <>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Ecoponto</label>
            <Select
              options={ecopontoOptions}
              value={filters.ecopontoId}
              onChange={(option) => handleFilterChange("ecopontoId", option)}
              placeholder="Selecionar ecoponto"
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Equipamento</label>
            <Select
              options={equipamentoOptions}
              value={filters.equipamentoId}
              onChange={(option) => handleFilterChange("equipamentoId", option)}
              placeholder="Selecionar equipamento"
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
        </>
      }
    />
  );
}
