import { apiRequest } from "../../middleware/request";

export default function DeleteTipoEcoponto({ tipoEcoponto, onNavigate }) {
  const handleDelete = async () => {
    if (!tipoEcoponto?.id) return;

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
      <div style={{ marginBottom: 16, padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 560 }}>
        <div><strong>Tipo:</strong> {tipoEcoponto.tipo}</div>
        <div><strong>Descrição:</strong> {tipoEcoponto.descricao}</div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} style={{ padding: "10px 14px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}>
          Delete Tipo Ecoponto
        </button>
        <button onClick={() => onNavigate("tipoecopontos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
