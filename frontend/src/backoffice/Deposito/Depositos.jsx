import { useState, useMemo } from "react";
import Select from "react-select";
import useDepositos from "./useDepositos";
import useTipoDepositos from "../TipoDeposito/useTipoDepositos";
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

export default function Depositos({ onNavigate }) {
  const { items: depositos, loading, error, refetch } = useDepositos();
  const { items: tipoDepositos } = useTipoDepositos();

  const [filters, setFilters] = useState({
    tipoDepositoId: null,
    descricao: "",
    capacidadeTotal: "",
    operadorCapacidade: "igual",
    altura: "",
    operadorAltura: "igual"
  });

  const operators = getOperatorOptions();

  const tipoOptions = useMemo(() =>
    Array.isArray(tipoDepositos) ? tipoDepositos.map(t => ({ value: t.id, label: t.tipo })) : [],
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
      tipoDepositoId: filters.tipoDepositoId?.value || null,
      descricao: filters.descricao,
      capacidadeTotal: filters.capacidadeTotal,
      operadorCapacidade: filters.operadorCapacidade,
      altura: filters.altura,
      operadorAltura: filters.operadorAltura
    };
    refetch(filterValues);
  };

  const handleClearFilters = () => {
    setFilters({
      tipoDepositoId: null,
      descricao: "",
      capacidadeTotal: "",
      operadorCapacidade: "igual",
      altura: "",
      operadorAltura: "igual"
    });
    refetch(null);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "capacidadeTotal", label: "Capacidade Total" },
    { key: "altura", label: "Altura" },
    {
      key: "tipoDepositoId",
      label: "Tipo",
      render: (item) =>
        Array.isArray(tipoDepositos)
          ? tipoDepositos.find((t) => t.id === item.tipoDepositoId)?.tipo ?? "Tipo de depósito não encontrado"
          : "Loading..."
    },
    { key: "descricao", label: "Descrição" },
  ];

  return (
    <ListTemplate
      title="Depósitos"
      addLabel="Add Depósito"
      onAdd={() => onNavigate("add-deposito")}
      loading={loading}
      error={error}
      items={depositos}
      totalLabel="Total de depósitos"
      emptyMessage="No depósitos found."
      columns={columns}
      getRowKey={(item) => item.id}
      onEdit={(item) => onNavigate("edit-deposito", item)}
      onDelete={(item) => onNavigate("delete-deposito", item)}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      filterSection={
        <>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Tipo de Depósito</label>
            <Select
              options={tipoOptions}
              value={filters.tipoDepositoId}
              onChange={(option) => handleFilterChange("tipoDepositoId", option)}
              placeholder="Selecionar tipo"
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

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Capacidade Total</label>
            <div style={{ display: "flex", gap: 8 }}>
              <Select
                options={operators}
                value={filters.operadorCapacidade}
                onChange={(option) => handleFilterChange("operadorCapacidade", option)}
                placeholder="Selecionar operador"
                isClearable
                styles={selectStyles}
              />
              <input
                type="number"
                value={filters.capacidadeTotal}
                onChange={(e) => handleFilterChange("capacidadeTotal", e.target.value)}
                placeholder="Valor"
                style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Altura</label>
            <div style={{ display: "flex", gap: 8 }}>
              <Select
                options={operators}
                value={filters.operadorAltura}
                onChange={(option) => handleFilterChange("operadorAltura", option)}
                placeholder="Selecionar operador"
                isClearable
                styles={selectStyles}
              />
              <input
                type="number"
                value={filters.altura}
                onChange={(e) => handleFilterChange("altura", e.target.value)}
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
