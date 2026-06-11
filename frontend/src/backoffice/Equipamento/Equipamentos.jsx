import { useState, useMemo } from "react";
import Select from "react-select";
import useEquipamentos from "./useEquipamentos.js";
import { getOperatorOptions } from "../../middleware/options"

export default function Equipamentos({ onNavigate }) {
  const { items: equipamentos, loading, error, refetch } = useEquipamentos();

  const [filters, setFilters] = useState({
    codigo: null,
    ativo: null,
    bateria: "",
    operadorBateria: "igual"
  });

  const operators = getOperatorOptions();

  // Create options for codigo
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

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Equipamentos</h2>
        <button
          onClick={() => onNavigate("add-equipamento")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Add Equipamento
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
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Status</label>
            <Select
              options={ativoOptions}
              value={filters.ativo}
              onChange={(option) => handleFilterChange("ativo", option)}
              placeholder="Todos"
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
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Bateria</label>
            <div style={{ display: "flex", gap: 8 }}>
              <Select
                options={operators}
                value={filters.operadorBateria}
                onChange={(option) => handleFilterChange("operadorBateria", option)}
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
                value={filters.bateria}
                onChange={(e) => handleFilterChange("bateria", e.target.value)}
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

      {loading && <p>Loading equipamentos...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading equipamentos: {error}</p>}

      {!loading && !error && (
        <>
          <div style={{ margin: "16px 0", padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
            <div style={{ color: "#666", fontSize: 14 }}>Total de equipamentos</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{equipamentos.length}</div>
          </div>

          {equipamentos.length === 0 ? (
            <p>No equipamentos found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "12px 8px" }}>Código</th>
                    <th style={{ padding: "12px 8px" }}>Bateria</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                    <th style={{ padding: "12px 8px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {equipamentos.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 8px" }}>{item.codigo}</td>
                      <td style={{ padding: "12px 8px" }}>{item.bateria}%</td>
                      <td style={{ padding: "12px 8px" }}>{item.ativo ? "Ativo" : "Inativo"}</td>
                      <td style={{ padding: "12px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => onNavigate("edit-equipamento", item)}
                          style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onNavigate("delete-equipamento", item)}
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
