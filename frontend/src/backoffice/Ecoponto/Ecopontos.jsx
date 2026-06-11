import { useState, useMemo } from "react";
import Select from "react-select";
import useDepositos from "../Deposito/useDepositos.js";
import useTipoEcopontos from "../TipoEcoponto/useTipoEcopontos.js";
import useEcopontos from "./useEcopontos.js";
import useEmpresas from "../Empresa/useEmpresas.js";
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

export default function Ecopontos({ onNavigate }) {
  const { items: depositos } = useDepositos();
  const { items: tipoEcopontos } = useTipoEcopontos();
  const { items: empresas } = useEmpresas();
  const { items: ecopontos, loading, error, refetch } = useEcopontos();

  const operators = getOperatorOptions();

  const [filters, setFilters] = useState({
    codigo: null,
    tipoEcopontoId: null,
    depositoId: null,
    empresaId: null,
    descricao: "",
    capacidadeAtual: "",
    operadorCapacidade: "igual"
  });

  const codigoOptions = useMemo(() =>
    ecopontos.map(e => ({ value: e.codigo, label: e.codigo })),
    [ecopontos]
  );

  const tipoOptions = useMemo(() =>
    Array.isArray(tipoEcopontos) ? tipoEcopontos.map(t => ({ value: t.id, label: t.tipo })) : [],
    [tipoEcopontos]
  );

  const depositoOptions = useMemo(() =>
    Array.isArray(depositos) ? depositos.map(d => ({ value: d.id, label: d.descricao })) : [],
    [depositos]
  );

  const empresaOptions = useMemo(() =>
    Array.isArray(empresas) ? empresas.map(e => ({ value: String(e.id), label: e.nome })) : [],
    [empresas]
  );

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    const filterValues = {
      codigo: filters.codigo?.value || null,
      tipoEcopontoId: filters.tipoEcopontoId?.value || null,
      depositoId: filters.depositoId?.value || null,
      descricao: filters.descricao,
      capacidadeAtual: filters.capacidadeAtual,
      operadorCapacidade: filters.operadorCapacidade,
      empresaId: filters.empresaId?.value || null
    };
    refetch(filterValues);
  };

  const handleClearFilters = () => {
    setFilters({
      codigo: null,
      tipoEcopontoId: null,
      depositoId: null,
      empresaId: null,
      descricao: "",
      capacidadeAtual: "",
      operadorCapacidade: "igual"
    });
    refetch(null);
  };

  const columns = [
    { key: "codigo", label: "Código" },
    {
      key: "tipoEcopontoId",
      label: "Tipo",
      render: (item) =>
        Array.isArray(tipoEcopontos)
          ? tipoEcopontos.find((t) => t.id === item.tipoEcopontoId)?.tipo ?? "Tipo de ecoponto não encontrado"
          : "Loading..."
    },
    {
      key: "depositoId",
      label: "Depósito",
      render: (item) =>
        Array.isArray(depositos)
          ? depositos.find((d) => d.id === item.depositoId)?.descricao ?? "Depósito não encontrado"
          : "Loading..."
    },
    { key: "capacidadeAtual", label: "Capacidade" },
  ];

  return (
    <ListTemplate
      title="Ecopontos"
      addLabel="Add Ecoponto"
      onAdd={() => onNavigate("add-ecoponto")}
      loading={loading}
      error={error}
      items={ecopontos}
      totalLabel="Total de ecopontos"
      emptyMessage="No ecopontos found."
      columns={columns}
      getRowKey={(item) => item.id}
      onEdit={(item) => onNavigate("edit-ecoponto", item)}
      onDelete={(item) => onNavigate("delete-ecoponto", item)}
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
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Tipo de Ecoponto</label>
            <Select
              options={tipoOptions}
              value={filters.tipoEcopontoId}
              onChange={(option) => handleFilterChange("tipoEcopontoId", option)}
              placeholder="Selecionar tipo"
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Depósito</label>
            <Select
              options={depositoOptions}
              value={filters.depositoId}
              onChange={(option) => handleFilterChange("depositoId", option)}
              placeholder="Selecionar depósito"
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Empresa</label>
            <Select
              options={empresaOptions}
              value={filters.empresaId}
              onChange={(option) => handleFilterChange("empresaId", option)}
              placeholder="Selecionar empresa"
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
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Capacidade</label>
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
                value={filters.capacidadeAtual}
                onChange={(e) => handleFilterChange("capacidadeAtual", e.target.value)}
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
