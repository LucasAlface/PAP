import { apiRequest } from "../../middleware/request";

export default function DeleteEcopontoEquipamento({ ecopontoEquipamento, onNavigate }) {
  const handleDelete = async () => {
    if (!ecopontoEquipamento?.ecopontoId || !ecopontoEquipamento?.equipamentoId) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ecoponto equipamento ${ecopontoEquipamento.ecopontoId}-${ecopontoEquipamento.equipamentoId}?`
      )
    ) {
      return;
    }

    try {
      await apiRequest(
        `/ecopontoequipamento/apagar/${ecopontoEquipamento.ecopontoId}/${ecopontoEquipamento.equipamentoId}`,
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
      <ul>
        <li><strong>Ecoponto ID:</strong> {ecopontoEquipamento.ecopontoId}</li>
        <li><strong>Equipamento ID:</strong> {ecopontoEquipamento.equipamentoId}</li>
        <li><strong>Ativo:</strong> {ecopontoEquipamento.ativo ? "Sim" : "Não"}</li>
      </ul>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} className="bo-btn header-btn-danger">
          Delete Ecoponto Equipamento
        </button>
        <button onClick={() => onNavigate("ecopontoequipamentos")} className="bo-btn bo-btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
}
