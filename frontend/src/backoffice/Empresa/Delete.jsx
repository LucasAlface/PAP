export default function DeleteEmpresa({ empresa, onNavigate }) {
  async function handleDelete() {
    if (!empresa?.id) {
      alert("Unable to delete: missing empresa information.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete empresa "${empresa.nome}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/empresa/deletar/${empresa.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete empresa");
      }

      alert("Empresa deleted successfully.");
      if (onNavigate) onNavigate("empresas");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <h2>Delete Empresa</h2>
      <p>Are you sure you want to delete the following empresa?</p>
      <ul>
        <li><strong>ID:</strong> {empresa.id}</li>
        <li><strong>Nome:</strong> {empresa.nome}</li>
        <li><strong>NIF:</strong> {empresa.nif}</li>
        <li><strong>Email:</strong> {empresa.email}</li>
        <li><strong>Telefone:</strong> {empresa.telefone}</li>
      </ul>
      <button onClick={handleDelete} style={{ padding: "10px 14px", borderRadius: 6, background: "#dc2626", color: "white", cursor: "pointer" }}>
        Delete Empresa
      </button>
      <button onClick={() => onNavigate("empresas")} style={{ padding: "10px 14px", borderRadius: 6, marginLeft: 12, cursor: "pointer" }}>
        Cancel
      </button>
    </div>
  );
}