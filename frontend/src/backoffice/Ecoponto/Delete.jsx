import { apiRequest } from "../../middleware/request";

export default function DeleteEcoponto({ ecoponto, onNavigate }) {
  const handleDelete = async () => {
    if (!ecoponto?.id) return;

    try {
      await apiRequest(`http://localhost:3000/ecoponto/apagar/${ecoponto.id}`, "DELETE");
      onNavigate("ecopontos");
    } catch (error) {
      alert(`Error deleting ecoponto: ${error.message}`);
    }
  };

  if (!ecoponto) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Delete Ecoponto</h2>
        <p style={{ color: "#b91c1c" }}>No ecoponto selected.</p>
        <button onClick={() => onNavigate("ecopontos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Back to Ecopontos
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Delete Ecoponto #{ecoponto.id}</h2>
      <p>Are you sure you want to delete this ecoponto?</p>
      <div style={{ marginBottom: 16, padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 560 }}>
        <div><strong>Código:</strong> {ecoponto.codigo}</div>
        <div><strong>Tipo Ecoponto ID:</strong> {ecoponto.tipoEcopontoId}</div>
        <div><strong>Depósito ID:</strong> {ecoponto.depositoId}</div>
        <div><strong>Capacidade Atual:</strong> {ecoponto.capacidadeAtual}</div>
        <div><strong>Latitude:</strong> {ecoponto.latitude}</div>
        <div><strong>Longitude:</strong> {ecoponto.longitude}</div>
        <div><strong>Descrição:</strong> {ecoponto.descricao}</div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} style={{ padding: "10px 14px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}>
          Delete Ecoponto
        </button>
        <button onClick={() => onNavigate("ecopontos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
