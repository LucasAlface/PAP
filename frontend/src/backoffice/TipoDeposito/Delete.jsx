import { apiRequest } from "../../middleware/request";

export default function DeleteTipoDeposito({ tipoDeposito, onNavigate }) {
  const handleDelete = async () => {
    if (!tipoDeposito?.id) return;

    if (!window.confirm(`Are you sure you want to delete tipo depósito "${tipoDeposito.tipo}"?`)) {
      return;
    }

    try {
      await apiRequest(`/tipodeposito/apagar/${tipoDeposito.id}`, "DELETE");
      onNavigate("tipodepositos");
    } catch (error) {
      alert(`Error deleting tipo depósito: ${error.message}`);
    }
  };

  if (!tipoDeposito) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Delete Tipo Depósito</h2>
        <p style={{ color: "#b91c1c" }}>No tipo depósito selected.</p>
        <button onClick={() => onNavigate("tipodepositos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Back to Tipo Depósitos
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Delete Tipo Depósito #{tipoDeposito.id}</h2>
      <p>Are you sure you want to delete this tipo depósito?</p>
      <ul>
        <li><strong>Tipo:</strong> {tipoDeposito.tipo}</li>
        <li><strong>Descrição:</strong> {tipoDeposito.descricao}</li>
      </ul>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} className="bo-btn header-btn-danger">
          Delete Tipo Depósito
        </button>
        <button onClick={() => onNavigate("tipodepositos")} className="bo-btn bo-btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
}
