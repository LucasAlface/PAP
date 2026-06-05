import { apiRequest } from "../../middleware/request";

export default function DeleteUtilizador({ utilizador, onNavigate }) {
  if (!utilizador?.id) {
    alert("Unable to delete: missing utilizador information.");
    if (onNavigate) onNavigate("utilizadores");
    return null;
  }

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete utilizador "${utilizador.nome}"?`)) {
      return;
    }

    try {
      await apiRequest(`http://localhost:3000/utilizador/apagar/${utilizador.id}`, "DELETE");
      // alert("Utilizador deleted successfully.");
      if (onNavigate) onNavigate("utilizadores");
    } catch (err) {
      alert(`Error deleting utilizador: ${err.message}`);
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Delete Utilizador</h2>
      <p>Are you sure you want to delete the following utilizador?</p>
      <ul>
        <li><strong>ID:</strong> {utilizador.id}</li>
        <li><strong>Nome:</strong> {utilizador.nome}</li>
        <li><strong>Email:</strong> {utilizador.email}</li>
        <li><strong>Cargo ID:</strong> {utilizador.cargoId}</li>
        <li><strong>Empresa ID:</strong> {utilizador.empresaId || "-"}</li>
      </ul>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleDelete}
          style={{ padding: "10px 16px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}
        >
          Delete Utilizador
        </button>
        <button
          onClick={() => onNavigate("utilizadores")}
          style={{ padding: "10px 16px", borderRadius: 6, cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
