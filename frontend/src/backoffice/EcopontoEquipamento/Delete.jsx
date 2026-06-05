import { apiRequest } from "../../middleware/request";

export default function DeleteEcopontoEquipamento({ ecopontoEquipamento, onNavigate }) {
  const handleDelete = async () => {
    if (!ecopontoEquipamento?.ecopontoId || !ecopontoEquipamento?.equipamentoId) return;

    try {
      await apiRequest(
        `http://localhost:3000/ecopontoequipamento/apagar/${ecopontoEquipamento.ecopontoId}/${ecopontoEquipamento.equipamentoId}`,
        "DELETE"
      );
      onNavigate("ecopontoequipamentos");
    } catch (error) {
      alert(`Error deleting ecoponto equipamento: ${error.message}`);
    }
  };

  if (!ecopontoEquipamento) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Delete Ecoponto Equipamento</h2>
        <p style={{ color: "#b91c1c" }}>No ecoponto equipamento selected.</p>
        <button onClick={() => onNavigate("ecopontoequipamentos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Back to Ecoponto Equipamentos
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Delete Ecoponto Equipamento</h2>
      <p>Are you sure you want to delete this ecoponto equipamento?</p>
      <div style={{ marginBottom: 16, padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 560 }}>
        <div><strong>Ecoponto ID:</strong> {ecopontoEquipamento.ecopontoId}</div>
        <div><strong>Equipamento ID:</strong> {ecopontoEquipamento.equipamentoId}</div>
        <div><strong>Ativo:</strong> {ecopontoEquipamento.ativo ? "Sim" : "Não"}</div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} style={{ padding: "10px 14px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}>
          Delete Ecoponto Equipamento
        </button>
        <button onClick={() => onNavigate("ecopontoequipamentos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
