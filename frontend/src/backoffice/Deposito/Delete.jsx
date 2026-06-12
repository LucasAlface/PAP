import { apiRequest } from "../../middleware/request";

export default function DeleteDeposito({ deposito, onNavigate }) {
  const handleDelete = async () => {
    if (!deposito?.id) return;

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
      <div style={{ marginBottom: 16, padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 560 }}>
        <div><strong>Capacidade Total:</strong> {deposito.capacidadeTotal}</div>
        <div><strong>Altura:</strong> {deposito.altura}</div>
        <div><strong>Tipo Depósito ID:</strong> {deposito.tipoDepositoId}</div>
        <div><strong>Descrição:</strong> {deposito.descricao}</div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} style={{ padding: "10px 14px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}>
          Delete Depósito
        </button>
        <button onClick={() => onNavigate("depositos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
