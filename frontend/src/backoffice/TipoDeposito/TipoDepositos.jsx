import { useState, useMemo } from "react";
import Select from "react-select";
import useTipoDepositos from "./useTipoDepositos.js";
import ListTemplate from "../ListTemplate.jsx";

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 6,
    borderColor: "#d1d5db",
    minHeight: 30
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
      
    />
  );
}
