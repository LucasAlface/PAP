export default function DeleteTipoDeposito({ tipoDeposito, onNavigate }) {
  const handleDelete = async () => {
    if (!tipoDeposito?.id) return;

    try {
      const res = await fetch(`http://localhost:3000/tipodeposito/apagar/${tipoDeposito.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.erro || "Failed to delete tipo depósito");
      }

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
      <div style={{ marginBottom: 16, padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 560 }}>
        <div><strong>Tipo:</strong> {tipoDeposito.tipo}</div>
        <div><strong>Descrição:</strong> {tipoDeposito.descricao}</div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={handleDelete} style={{ padding: "10px 14px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}>
          Delete Tipo Depósito
        </button>
        <button onClick={() => onNavigate("tipodepositos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
