export default function ListTemplate({
  title,
  addLabel,
  onAdd,
  loading,
  error,
  items,
  totalLabel,
  emptyMessage,
  columns,
  getRowKey,
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  filterSection,
  onApplyFilters,
  onClearFilters,
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        {onAdd && (
          <button
            onClick={onAdd}
            style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
          >
            {addLabel || `Add ${title}`}
          </button>
        )}
      </div>

      {/* Filter Section */}
      {filterSection && (
        <div style={{ margin: "16px 0", padding: 16, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Filtros</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 12 }}>
            {filterSection}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onApplyFilters}
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
              onClick={onClearFilters}
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
      )}

      {loading && <p>Loading {title.toLowerCase()}...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading {title.toLowerCase()}: {error}</p>}

      {!loading && !error && (
        <>
          <div style={{ margin: "16px 0", padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
            <div style={{ color: "#666", fontSize: 14 }}>{totalLabel || `Total de ${title.toLowerCase()}`}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{items.length}</div>
          </div>

          {items.length === 0 ? (
            <p>{emptyMessage || `No ${title.toLowerCase()} found.`}</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    {columns.map((col) => (
                      <th key={col.key} style={{ padding: "12px 8px" }}>{col.label}</th>
                    ))}
                    {(onEdit || onDelete) && <th style={{ padding: "12px 8px" }}>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={getRowKey(item)} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      {columns.map((col) => (
                        <td key={col.key} style={{ padding: "12px 8px" }}>
                          {col.render ? col.render(item) : item[col.key]}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td style={{ padding: "12px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer" }}
                            >
                              {editLabel}
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              style={{ padding: "8px 10px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}
                            >
                              {deleteLabel}
                            </button>
                          )}
                        </td>
                      )}
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
