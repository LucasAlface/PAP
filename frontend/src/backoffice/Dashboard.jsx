import { useEffect, useState } from "react";

export default function Dashboard() {
        const [stats, setStats] = useState([]);

    useEffect(() => {
           fetch("http://localhost:3000/ecoponto/total")
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
        });
    }, []);
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 8, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Total Users</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>128</div>
        </div>
        <div style={{ padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 8, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Ecopontos</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.total}</div>
        </div>
      </div>
      <section style={{ marginTop: 20 }}>
        <h3>Recent activity</h3>
        <ul>
          <li>Logged 3 deposits</li>
          <li>Added 1 equipamento</li>
        </ul>
      </section>
    </div>
  );
}
