import { useEffect, useState } from "react";

export default function Ecopontos() {
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/ecoponto/total")
      .then((res) => res.json())
      .then((result) => {
        setTotal(result.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Ecopontos</h2>
      {loading && <p>Loading ecoponto summary...</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error loading ecopontos: {error}</p>}
      {total !== null && (
        <div style={{ padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 10, maxWidth: 320 }}>
          <div style={{ color: "#666", fontSize: 14 }}>Total registered ecopontos</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{total}</div>
        </div>
      )}
      <p style={{ marginTop: 20, maxWidth: 640 }}>
        Use the Add Ecoponto page to create new ecopontos. Existing details are not listed here because the backend currently exposes only the total count.
      </p>
    </div>
  );
}
