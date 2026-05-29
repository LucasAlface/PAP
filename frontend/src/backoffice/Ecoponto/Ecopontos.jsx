import { useState, useMemo } from "react";
import Select from "react-select";
import useDepositos from "../Deposito/useDepositos.js";
import useTipoEcopontos from "../TipoEcoponto/useTipoEcopontos.js";
import useEcopontos from "./useEcopontos.js";
import {getOperatorOptions} from "../../middleware/options"

export default function Ecopontos({ onNavigate }) {
  const { depositos } = useDepositos();
  const { items: tipoEcopontos } = useTipoEcopontos();
  const { ecopontos, loading, error, refetch } = useEcopontos();

  const operators = getOperatorOptions();

  const [filters, setFilters] = useState({
    codigo: null,
    tipoEcopontoId: null,
    depositoId: null,
    descricao: "",
    capacidadeAtual: "",
    operadorCapacidade: "igual"
  });

  // Create options for codigo, tipoEcoponto, and deposito
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
      operadorCapacidade: filters.operadorCapacidade
    };
    refetch(filterValues);
  };

  const handleClearFilters = () => {
    setFilters({
      codigo: null,
      tipoEcopontoId: null,
      depositoId: null,
      descricao: "",
      capacidadeAtual: "",
      operadorCapacidade: "igual"
    });
    refetch(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Ecopontos</h2>
        <button
          onClick={() => onNavigate("add-ecoponto")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Add Ecoponto
        </button>
      </div>

      {/* Filter Section */}
      <div style={{ margin: "16px 0", padding: 16, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Filtros</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Código</label>
            <Select
              options={codigoOptions}
              value={filters.codigo}
              onChange={(option) => handleFilterChange("codigo", option)}
              placeholder="Selecionar código"
              isClearable
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: 6,
                  borderColor: "#d1d5db",
                  minHeight: 38
                })
              }}
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
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: 6,
                  borderColor: "#d1d5db",
                  minHeight: 38
                })
              }}
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
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: 6,
                  borderColor: "#d1d5db",
                  minHeight: 38
                })
              }}
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
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: 6,
                    borderColor: "#d1d5db",
                    minHeight: 38
                  })
                }}
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
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background: "#3b82f6",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? "Carregando..." : "Aplicar Filtros"}
          </button>
          <button
            onClick={handleClearFilters}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: "white",
              color: "#374151",
              cursor: "pointer"
            }}
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {loading && <p>Loading ecopontos...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading ecopontos: {error}</p>}

      {!loading && !error && (
        <>
          <div style={{ margin: "16px 0", padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
            <div style={{ color: "#666", fontSize: 14 }}>Total de ecopontos</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{ecopontos.length}</div>
          </div>

          {ecopontos.length === 0 ? (
            <p>No ecopontos found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "12px 8px" }}>Código</th>
                    <th style={{ padding: "12px 8px" }}>Tipo</th>
                    <th style={{ padding: "12px 8px" }}>Depósito</th>
                    <th style={{ padding: "12px 8px" }}>Capacidade</th>
                    <th style={{ padding: "12px 8px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ecopontos.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 8px" }}>{item.codigo}</td>
                      <td style={{ padding: "12px 8px" }}>
                        {Array.isArray(tipoEcopontos)
                          ? tipoEcopontos.find((t) => t.id === item.tipoEcopontoId)?.tipo ??
                            "Tipo de ecoponto não encontrado"
                          : "Loading..."}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                      {Array.isArray(depositos)
                        ? depositos.find((d) => d.id === item.depositoId)?.descricao ??
                          "Depósito não encontrado"
                        : "Loading..."}
                    </td>
                      <td style={{ padding: "12px 8px" }}>{item.capacidadeAtual}</td>
                      <td style={{ padding: "12px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => onNavigate("edit-ecoponto", item)}
                          style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onNavigate("delete-ecoponto", item)}
                          style={{ padding: "8px 10px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
