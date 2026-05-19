import { useState } from "react";

const initial = [
  { id: 1, name: "Ana Silva", email: "ana@example.com" },
  { id: 2, name: "João Costa", email: "joao@example.com" },
];

export default function Users() {
  const [users, setUsers] = useState(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function addUser(e) {
    e.preventDefault();
    if (!name || !email) return;
    setUsers((s) => [...s, { id: Date.now(), name, email }]);
    setName("");
    setEmail("");
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Users</h2>

      <form onSubmit={addUser} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
            <th style={{ padding: "8px 4px" }}>ID</th>
            <th style={{ padding: "8px 4px" }}>Name</th>
            <th style={{ padding: "8px 4px" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ padding: "8px 4px", borderBottom: "1px solid #f6f6f6" }}>{u.id}</td>
              <td style={{ padding: "8px 4px", borderBottom: "1px solid #f6f6f6" }}>{u.name}</td>
              <td style={{ padding: "8px 4px", borderBottom: "1px solid #f6f6f6" }}>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
