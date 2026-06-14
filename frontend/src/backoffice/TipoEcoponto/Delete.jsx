import { apiRequest } from "../../middleware/request";

export default function DeleteTipoEcoponto({ tipoEcoponto, onNavigate }) {
  const handleDelete = async () => {
    if (!tipoEcoponto?.id) return;

    if (!window.confirm(`Are you sure you want to delete tipo ecoponto "${tipoEcoponto.tipo}"?`)) {
      return;
    }

    try {
      await apiRequest(`/tipoecoponto/apagar/${tipoEcoponto.id}`, "DELETE");
      onNavigate("tipoecopontos");
    } catch (error) {
      alert(`Error deleting tipo ecoponto: ${error.message}`);
    }
  };

  if (!tipoEcoponto) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Delete Tipo Ecoponto</h2>
        <p style={{ color: "#b91c1c" }}>No tipo ecoponto selected.</p>
        <button onClick={() => onNavigate("tipoecopontos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Back to Tipo Ecopontos
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Delete Tipo Ecoponto #{tipoEcoponto.id}</h2>
      <p>Are you sure you want to delete this tipo ecoponto?</p>
      <ul>
        <li><strong>Tipo:</strong> {tipoEcoponto.tipo}</li>
        <li><strong>Descrição:</strong> {tipoEcoponto.descricao}</li>
      </ul>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} className="bo-btn header-btn-danger">
          Delete Tipo Ecoponto
        </button>
        <button onClick={() => onNavigate("tipoecopontos")} className="bo-btn bo-btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
}
