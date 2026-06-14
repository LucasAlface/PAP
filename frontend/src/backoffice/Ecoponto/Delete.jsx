import { apiRequest } from "../../middleware/request";

export default function DeleteEcoponto({ ecoponto, onNavigate }) {
  const handleDelete = async () => {
    if (!ecoponto?.id) return;

    if (!window.confirm(`Are you sure you want to delete ecoponto "${ecoponto.codigo}"?`)) {
      return;
    }

    try {
      await apiRequest(`/ecoponto/apagar/${ecoponto.id}`, "DELETE");
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
      <ul>
        <li><strong>Código:</strong> {ecoponto.codigo}</li>
        <li><strong>Tipo Ecoponto ID:</strong> {ecoponto.tipoEcopontoId}</li>
        <li><strong>Depósito ID:</strong> {ecoponto.depositoId}</li>
        <li><strong>Capacidade Atual:</strong> {ecoponto.capacidadeAtual}</li>
        <li><strong>Latitude:</strong> {ecoponto.latitude}</li>
        <li><strong>Longitude:</strong> {ecoponto.longitude}</li>
        <li><strong>Descrição:</strong> {ecoponto.descricao}</li>
      </ul>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} className="bo-btn header-btn-danger">
          Delete Ecoponto
        </button>
        <button onClick={() => onNavigate("ecopontos")} className="bo-btn bo-btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
}
