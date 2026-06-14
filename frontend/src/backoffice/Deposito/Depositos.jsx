import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import useDepositos from "./useDepositos";
import useTipoDepositos from "../TipoDeposito/useTipoDepositos";
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

export default function Depositos({ onNavigate }) {
  const { items: depositos, loading, error, refetch } = useDepositos();
  const { items: tipoDepositos } = useTipoDepositos();
  const [capacidadeTotalMaxLimit, setCapacidadeTotalMaxLimit] = useState(0);
  const [alturaMaxLimit, setAlturaMaxLimit] = useState(0);

  const [filters, setFilters] = useState({
    tipoDepositoId: null,
    descricao: "",
    capacidadeTotalMin: "",
    capacidadeTotalMax: "",
    alturaMin: "",
    alturaMax: ""
  });

  const tipoOptions = useMemo(() =>
    Array.isArray(tipoDepositos) ? tipoDepositos.map(t => ({ value: t.id, label: t.tipo })) : [],
    [tipoDepositos]
  );

  useEffect(() => {
    setCapacidadeTotalMaxLimit((currentLimit) =>
      getNextMaxLimit(currentLimit, depositos, "capacidadeTotal")
    );
    setAlturaMaxLimit((currentLimit) =>
      getNextMaxLimit(currentLimit, depositos, "altura")
    );
  }, [depositos]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    const capacidadeTotalMin = Number(filters.capacidadeTotalMin) > 0
      ? filters.capacidadeTotalMin
      : null;
    const capacidadeTotalMax = filters.capacidadeTotalMax &&
      Number(filters.capacidadeTotalMax) < capacidadeTotalMaxLimit
        ? filters.capacidadeTotalMax
        : null;
    const alturaMin = Number(filters.alturaMin) > 0
      ? filters.alturaMin
      : null;
    const alturaMax = filters.alturaMax &&
      Number(filters.alturaMax) < alturaMaxLimit
        ? filters.alturaMax
        : null;

    const filterValues = {
      tipoDepositoId: filters.tipoDepositoId?.value || null,
      descricao: filters.descricao,
      capacidadeTotalMin,
      capacidadeTotalMax,
      alturaMin,
      alturaMax
    };
    refetch(filterValues);
  };

  const handleClearFilters = () => {
    setFilters({
      tipoDepositoId: null,
      descricao: "",
      capacidadeTotalMin: "",
      capacidadeTotalMax: "",
      alturaMin: "",
      alturaMax: ""
    });
    refetch(null);
  };

  const columns = [
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
            <label>Tipo de Depósito</label>
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
            <label>Descrição</label>
            <input
              type="text"
              value={filters.descricao}
              onChange={(e) => handleFilterChange("descricao", e.target.value)}
              placeholder="Pesquisar por descrição"
            />
          </div>

          <RangeSliderFilter
            label="Capacidade Total"
            minValue={filters.capacidadeTotalMin}
            maxValue={filters.capacidadeTotalMax}
            maxLimit={capacidadeTotalMaxLimit}
            onMinChange={(value) => handleFilterChange("capacidadeTotalMin", value)}
            onMaxChange={(value) => handleFilterChange("capacidadeTotalMax", value)}
          />

          <RangeSliderFilter
            label="Altura"
            minValue={filters.alturaMin}
            maxValue={filters.alturaMax}
            maxLimit={alturaMaxLimit}
            onMinChange={(value) => handleFilterChange("alturaMin", value)}
            onMaxChange={(value) => handleFilterChange("alturaMax", value)}
          />
        </>
      }
    />
  );
}
