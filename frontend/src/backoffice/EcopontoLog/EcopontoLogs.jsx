import { useMemo, useState } from "react";
import Select from "react-select";
import ListTemplate from "../ListTemplate.jsx";
import useEcopontoLogs from "./useEcopontoLogs.js";
import useEcopontos from "../Ecoponto/useEcopontos.js";
import useEquipamentos from "../Equipamento/useEquipamentos.js";

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 6,
    borderColor: "#d1d5db",
    minHeight: 30
  })
};

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("pt-PT");
}

export default function EcopontoLogs() {
  const { items: ecopontoLogs, loading, error, refetch } = useEcopontoLogs();
  const { items: ecopontos } = useEcopontos();
  const { items: equipamentos } = useEquipamentos();
  const [filters, setFilters] = useState({
    codigoEcoponto: null,
    codigoEquipamento: null,
    detalhes: "",
    dataInicio: "",
    dataFim: "",
  });

  const ecopontoOptions = useMemo(() => ecopontos.map((e) => ({ value: String(e.codigo), label: `${e.codigo} - ${e.descricao || ""}` })), [ecopontos]);
  const equipamentoOptions = useMemo(() => equipamentos.map((eq) => ({ value: String(eq.codigo), label: `${eq.codigo} - ${eq.descricao || ""}` })), [equipamentos]);


  const handleFilterChange = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    refetch({
      codigoEcoponto: filters.codigoEcoponto?.value || null,
      codigoEquipamento: filters.codigoEquipamento?.value || null,
      detalhes: filters.detalhes,
      dataInicio: filters.dataInicio,
      dataFim: filters.dataFim,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      codigoEcoponto: null,
      codigoEquipamento: null,
      detalhes: "",
      dataInicio: "",
      dataFim: "",
    });
    refetch(null);
  };

  const columns = [
    { key: "codigoEcoponto", label: "Ecoponto", render: (item) => item.codigoEcoponto || "-" },
    { key: "codigoEquipamento", label: "Equipamento", render: (item) => item.codigoEquipamento || "-" },
    { key: "detalhes", label: "Detalhes", render: (item) => item.detalhes || "-" },
    { key: "data", label: "Data", render: (item) => formatDate(item.data) },
  ];

  return (
    <ListTemplate
      title="Logs de Ecopontos"
      loading={loading}
      error={error}
      items={ecopontoLogs}
      totalLabel="Total de logs"
      emptyMessage="No ecoponto logs found."
      columns={columns}
      getRowKey={(item) => item.id}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      filterSection={
        <>
          <div>
            <label>Ecoponto</label>
            <Select
              options={ecopontoOptions}
              value={filters.codigoEcoponto}
              onChange={(option) => handleFilterChange("codigoEcoponto", option)}
              placeholder="Selecionar ecoponto"
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </div>

          <div>
            <label>Equipamento</label>
            <Select
              options={equipamentoOptions}
              value={filters.codigoEquipamento}
              onChange={(option) => handleFilterChange("codigoEquipamento", option)}
              placeholder="Selecionar equipamento"
              isClearable
              isSearchable
              styles={selectStyles}
            />
          </div>

          <div>
            <label>Detalhes</label>
            <input
              value={filters.detalhes}
              onChange={(event) => handleFilterChange("detalhes", event.target.value)}
              placeholder="Pesquisar nos detalhes"
            />
          </div>

          <div>
            <label>Data início</label>
            <input
              type="date"
              value={filters.dataInicio}
              onChange={(event) => handleFilterChange("dataInicio", event.target.value)}
            />
          </div>

          <div>
            <label>Data fim</label>
            <input
              type="date"
              value={filters.dataFim}
              onChange={(event) => handleFilterChange("dataFim", event.target.value)}
            />
          </div>
        </>
      }
    />
  );
}
