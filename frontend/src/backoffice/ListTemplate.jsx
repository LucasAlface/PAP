import { Filter, Pencil, Plus, Search, Trash2, X } from "lucide-react";

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
    <div className="list-template">
      <div className="template-header">
        <div>
          <span className="template-kicker">Listagem</span>
          <h2>{title}</h2>
        </div>
        {onAdd && (
          <button type="button" onClick={onAdd} className="bo-btn bo-btn-primary">
            <Plus size={16} />
            {addLabel || `Add ${title}`}
          </button>
        )}
      </div>

      {filterSection && (
        <div className="filter-card">
          <div className="filter-title">
            <Filter size={16} />
            <h3>Filtros</h3>
          </div>

          <div className="filter-grid">
            {filterSection}
          </div>

          <div className="filter-actions">
            <button
              type="button"
              onClick={onApplyFilters}
              disabled={loading}
              className="bo-btn bo-btn-primary"
            >
              <Search size={15} />
              {loading ? "A carregar..." : "Aplicar filtros"}
            </button>
            <button
              type="button"
              onClick={onClearFilters}
              className="bo-btn bo-btn-ghost"
            >
              <X size={15} />
              Limpar filtros
            </button>
          </div>
        </div>
      )}

      {loading && <p className="template-muted">A carregar {title.toLowerCase()}...</p>}
      {error && <p className="template-error">Erro ao carregar {title.toLowerCase()}: {error}</p>}

      {!loading && !error && (
        <>
          <div className="total-card">
            <div>{totalLabel || `Total de ${title.toLowerCase()}`}</div>
            <strong>{items.length}</strong>
          </div>

          {items.length === 0 ? (
            <p className="template-muted">{emptyMessage || `No ${title.toLowerCase()} found.`}</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                    {(onEdit || onDelete) && <th>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={getRowKey(item)}>
                      {columns.map((col) => (
                        <td key={col.key}>
                          {col.render ? col.render(item) : item[col.key]}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td>
                          <div className="table-actions">
                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(item)}
                              className="icon-btn"
                              title={editLabel}
                            >
                              <Pencil size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(item)}
                              className="icon-btn icon-btn-danger"
                              title={deleteLabel}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                          </div>
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
