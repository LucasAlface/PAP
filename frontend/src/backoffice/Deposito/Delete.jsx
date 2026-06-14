import { apiRequest } from "../../middleware/request";

export default function DeleteDeposito({ deposito, onNavigate }) {
  const handleDelete = async () => {
    if (!deposito?.id) return;

    if (!window.confirm(`Are you sure you want to delete depósito #${deposito.id}?`)) {
      return;
    }

    try {
      await apiRequest(`/deposito/apagar/${deposito.id}`, "DELETE");
      onNavigate("depositos");
    } catch (error) {
      alert(`Error deleting depósito: ${error.message}`);
    }
  };

  if (!deposito) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Delete Depósito</h2>
        <p style={{ color: "#b91c1c" }}>No depósito selected.</p>
        <button onClick={() => onNavigate("depositos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Back to Depósitos
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Delete Depósito #{deposito.id}</h2>
      <p>Are you sure you want to delete this depósito?</p>
      <ul>
        <li><strong>Capacidade Total:</strong> {deposito.capacidadeTotal}</li>
        <li><strong>Altura:</strong> {deposito.altura}</li>
        <li><strong>Tipo Depósito ID:</strong> {deposito.tipoDepositoId}</li>
        <li><strong>Descrição:</strong> {deposito.descricao}</li>
      </ul>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} className="bo-btn header-btn-danger">
          Delete Depósito
        </button>
        <button onClick={() => onNavigate("depositos")} className="bo-btn bo-btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
}
