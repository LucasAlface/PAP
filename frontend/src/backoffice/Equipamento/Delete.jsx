export default function DeleteEquipamento({ equipamento, onNavigate }) {
  const handleDelete = async () => {
    if (!equipamento?.id) return;

    try {
      const res = await fetch(`http://localhost:3000/equipamento/apagar/${equipamento.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.erro || "Failed to delete equipamento");
      }

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
      <div style={{ marginBottom: 16, padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 560 }}>
        <div><strong>Código:</strong> {equipamento.codigo}</div>
        <div><strong>Ativo:</strong> {equipamento.ativo ? "Sim" : "Não"}</div>
        <div><strong>Bateria:</strong> {equipamento.bateria}</div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} style={{ padding: "10px 14px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}>
          Delete Equipamento
        </button>
        <button onClick={() => onNavigate("equipamentos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
