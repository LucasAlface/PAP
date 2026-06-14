import { apiRequest } from "../../middleware/request";

export default function DeleteEquipamento({ equipamento, onNavigate }) {
  const handleDelete = async () => {
    if (!equipamento?.id) return;

    if (!window.confirm(`Are you sure you want to delete equipamento "${equipamento.codigo}"?`)) {
      return;
    }

    try {
      await apiRequest(`/equipamento/apagar/${equipamento.id}`, "DELETE");
      onNavigate("equipamentos");
    } catch (error) {
      alert(`Error deleting equipamento: ${error.message}`);
    }
  };

  if (!equipamento) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Delete Equipamento</h2>
        <p style={{ color: "#b91c1c" }}>No equipamento selected.</p>
        <button onClick={() => onNavigate("equipamentos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Back to Equipamentos
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Delete Equipamento #{equipamento.id}</h2>
      <p>Are you sure you want to delete this equipamento?</p>
      <ul>
        <li><strong>Código:</strong> {equipamento.codigo}</li>
        <li><strong>Ativo:</strong> {equipamento.ativo ? "Sim" : "Não"}</li>
        <li><strong>Bateria:</strong> {equipamento.bateria}</li>
      </ul>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} className="bo-btn header-btn-danger">
          Delete Equipamento
        </button>
        <button onClick={() => onNavigate("equipamentos")} className="bo-btn bo-btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
}
