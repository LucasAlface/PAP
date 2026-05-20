import { useEffect, useState } from "react";

export default function Equipamentos({ onNavigate }) {
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/equipamento/total")
      .then((res) => res.json())
      .then((result) => {
        setTotal(result.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Equipamentos</h2>
        <button
          onClick={() => onNavigate("add-equipamento")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Add Equipamento
        </button>
      </div>

      {loading && <p>Loading equipamento summary...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading equipamentos: {error}</p>}
      {total !== null && (
        <div style={{ padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
          <div style={{ color: "#666", fontSize: 14 }}>Total registered equipamentos</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{total}</div>
        </div>
      )}
    </div>
  );
}
