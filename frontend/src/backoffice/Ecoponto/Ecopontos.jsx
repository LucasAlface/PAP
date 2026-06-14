import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import useDepositos from "../Deposito/useDepositos.js";
import useTipoEcopontos from "../TipoEcoponto/useTipoEcopontos.js";
import useEcopontos from "./useEcopontos.js";
import useEmpresas from "../Empresa/useEmpresas.js";
import ListTemplate from "../ListTemplate.jsx";
import RangeSliderFilter, { getNextMaxLimit } from "../RangeSliderFilter.jsx";

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 6,
    borderColor: "#d1d5db",
    minHeight: 30
  })
};

export default function Ecopontos({ onNavigate }) {
  const { items: depositos } = useDepositos();
  const { items: tipoEcopontos } = useTipoEcopontos();
  const { items: empresas } = useEmpresas();
  const { items: ecopontos, loading, error, refetch } = useEcopontos();
  const [capacidadeAtualMaxLimit, setCapacidadeAtualMaxLimit] = useState(0);
  const [capacidadeTotalMaxLimit, setCapacidadeTotalMaxLimit] = useState(0);

  const [filters, setFilters] = useState({
    codigo: null,
    tipoEcopontoId: null,
    depositoId: null,
    empresaId: null,
    descricao: "",
    capacidadeAtualMin: "",
    capacidadeAtualMax: "",
    capacidadeTotalMin: "",
    capacidadeTotalMax: ""
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

  useEffect(() => {
    setCapacidadeAtualMaxLimit((currentLimit) =>
      getNextMaxLimit(currentLimit, ecopontos, "capacidadeAtual")
    );
  }, [ecopontos]);

  useEffect(() => {
    setCapacidadeTotalMaxLimit((currentLimit) =>
      getNextMaxLimit(currentLimit, depositos, "capacidadeTotal")
    );
  }, [depositos]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    const capacidadeAtualMin = Number(filters.capacidadeAtualMin) > 0
      ? filters.capacidadeAtualMin
      : null;
    const capacidadeAtualMax = filters.capacidadeAtualMax &&
      Number(filters.capacidadeAtualMax) < capacidadeAtualMaxLimit
        ? filters.capacidadeAtualMax
        : null;
    const capacidadeTotalMin = Number(filters.capacidadeTotalMin) > 0
      ? filters.capacidadeTotalMin
      : null;
    const capacidadeTotalMax = filters.capacidadeTotalMax &&
      Number(filters.capacidadeTotalMax) < capacidadeTotalMaxLimit
        ? filters.capacidadeTotalMax
        : null;

    const filterValues = {
      codigo: filters.codigo?.value || null,
      tipoEcopontoId: filters.tipoEcopontoId?.value || null,
      depositoId: filters.depositoId?.value || null,
      descricao: filters.descricao,
      capacidadeAtualMin,
      capacidadeAtualMax,
      capacidadeTotalMin,
      capacidadeTotalMax,
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
      capacidadeAtualMin: "",
      capacidadeAtualMax: "",
      capacidadeTotalMin: "",
      capacidadeTotalMax: ""
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
    {
      key: "capacidadeTotal",
      label: "Capacidade total",
      render: (item) =>
        Array.isArray(depositos)
          ? depositos.find((d) => d.id === item.depositoId)?.capacidadeTotal ?? "-"
          : "Loading..."
    },
    { key: "capacidadeAtual", label: "Capacidade restante" },
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
            <label>Tipo de Ecoponto</label>
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
            <label>Depósito</label>
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
            <label>Empresa</label>
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
            <label>Descrição</label>
            <input
              type="text"
              value={filters.descricao}
              onChange={(e) => handleFilterChange("descricao", e.target.value)}
              placeholder="Pesquisar por descrição"
            />
          </div>

          <RangeSliderFilter
            label="Capacidade restante"
            minValue={filters.capacidadeAtualMin}
            maxValue={filters.capacidadeAtualMax}
            maxLimit={capacidadeAtualMaxLimit}
            onMinChange={(value) => handleFilterChange("capacidadeAtualMin", value)}
            onMaxChange={(value) => handleFilterChange("capacidadeAtualMax", value)}
          />

          <RangeSliderFilter
            label="Capacidade total"
            minValue={filters.capacidadeTotalMin}
            maxValue={filters.capacidadeTotalMax}
            maxLimit={capacidadeTotalMaxLimit}
            onMinChange={(value) => handleFilterChange("capacidadeTotalMin", value)}
            onMaxChange={(value) => handleFilterChange("capacidadeTotalMax", value)}
          />
        </>
      }
    />
  );
}
