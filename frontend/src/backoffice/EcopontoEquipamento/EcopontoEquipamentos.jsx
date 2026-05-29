import { useState, useMemo } from "react";
import Select from "react-select";
import useEcopontoEquipamentos from "./useEcopontoEquipamentos.js";
import useEcopontos from "../Ecoponto/useEcopontos.js";
import useEquipamentos from "../Equipamento/useEquipamentos.js";

export default function EcopontoEquipamentos({ onNavigate }) {
  const { items, loading, error, refetch } = useEcopontoEquipamentos();
  const { ecopontos } = useEcopontos();
  const { equipamentos } = useEquipamentos();

  const [filters, setFilters] = useState({
    ecopontoId: null,
    equipamentoId: null,
    ativo: null
  });

  // Create options for ecoponto codigo and equipamento codigo
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

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Ecoponto Equipamentos</h2>
        <button
          onClick={() => onNavigate("add-ecopontoequipamento")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Add Ecoponto Equipamento
        </button>
      </div>

      {/* Filter Section */}
      <div style={{ margin: "16px 0", padding: 16, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Filtros</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Ecoponto</label>
            <Select
              options={ecopontoOptions}
              value={filters.ecopontoId}
              onChange={(option) => handleFilterChange("ecopontoId", option)}
              placeholder="Selecionar ecoponto"
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
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Equipamento</label>
            <Select
              options={equipamentoOptions}
              value={filters.equipamentoId}
              onChange={(option) => handleFilterChange("equipamentoId", option)}
              placeholder="Selecionar equipamento"
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

      {loading && <p>Loading ecoponto equipamentos...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading ecoponto equipamentos: {error}</p>}

      {!loading && !error && (
        <>
          <div style={{ margin: "16px 0", padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
            <div style={{ color: "#666", fontSize: 14 }}>Total de ecoponto equipamentos</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{items.length}</div>
          </div>

          {items.length === 0 ? (
            <p>No ecoponto equipamentos found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "12px 8px" }}>Ecoponto</th>
                    <th style={{ padding: "12px 8px" }}>Equipamento</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                    <th style={{ padding: "12px 8px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={`${item.ecopontoId}-${item.equipamentoId}`} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 8px" }}>
                        {Array.isArray(ecopontos)
                          ? ecopontos.find((e) => e.id === item.ecopontoId)?.codigo ??
                            "Ecoponto não encontrado"
                          : "Loading..."}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        {Array.isArray(equipamentos)
                          ? equipamentos.find((eq) => eq.id === item.equipamentoId)?.codigo ??
                            "Equipamento não encontrado"
                          : "Loading..."}
                      </td>
                      <td style={{ padding: "12px 8px" }}>{item.ativo ? "Ativo" : "Inativo"}</td>
                      <td style={{ padding: "12px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => onNavigate("edit-ecopontoequipamento", item)}
                          style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onNavigate("delete-ecopontoequipamento", item)}
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
