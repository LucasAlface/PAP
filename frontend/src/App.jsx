import { useState } from "react";
import Mapa from "./mapa";

export default function App() {
  const [showMapa, setShowMapa] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ padding: 12, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ margin: 0, fontSize: 18 }}>PAP - Mapa</h1>
        <button
          onClick={() => setShowMapa((s) => !s)}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer" }}
        >
          {showMapa ? "Hide Mapa" : "Show Mapa"}
        </button>
      </header>

      <main style={{ flex: 1, position: "relative" }}>
        {showMapa ? (
          <Mapa />
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
            Click "Show Mapa" to display the map.
          </div>
        )}
      </main>
    </div>
  );
}