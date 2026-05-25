import { useEffect, useState } from "react";
import { apiRequest } from "../../middleware/request";

export default function EcopontoForm({ ecoponto, onNavigate }) {
  const [codigo, setCodigo] = useState("");
  const [tipoEcopontoId, setTipoEcopontoId] = useState("");
  const [depositoId, setDepositoId] = useState("");
  const [capacidadeAtual, setCapacidadeAtual] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");

  const isEditMode = !!ecoponto;

  useEffect(() => {
    if (isEditMode && ecoponto) {
      setCodigo(ecoponto.codigo ?? "");
      setTipoEcopontoId(ecoponto.tipoEcopontoId ?? "");
      setDepositoId(ecoponto.depositoId ?? "");
      setCapacidadeAtual(ecoponto.capacidadeAtual ?? "");
      setLatitude(ecoponto.latitude ?? "");
      setLongitude(ecoponto.longitude ?? "");
      setDescricao(ecoponto.descricao ?? "");
    }
  }, [ecoponto, isEditMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    if (isEditMode && !ecoponto?.id) {
      setStatus("Unable to update: missing ecoponto information.");
      return;
    }

    const payload = {
      codigo,
      tipoEcopontoId: tipoEcopontoId ? Number(tipoEcopontoId) : null,
      depositoId: depositoId ? Number(depositoId) : null,
      capacidadeAtual: capacidadeAtual ? Number(capacidadeAtual) : null,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      descricao,
    };

    try {
      const endpoint = isEditMode
        ? `http://localhost:3000/ecoponto/atualizar/${ecoponto.id}`
        : "http://localhost:3000/ecoponto/inserir";

      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : [payload];

      await apiRequest(endpoint, method, requestData);

      if (isEditMode) {
        setStatus("Ecoponto updated successfully.");
        if (onNavigate) onNavigate("ecopontos");
      } else {
        setStatus("Ecoponto added successfully.");
        setCodigo("");
        setTipoEcopontoId("");
        setDepositoId("");
        setCapacidadeAtual("");
        setLatitude("");
        setLongitude("");
        setDescricao("");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  if (isEditMode && !ecoponto) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Ecoponto</h2>
        <p style={{ color: "#b91c1c" }}>No ecoponto selected.</p>
        <button
          onClick={() => onNavigate("ecopontos")}
          style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
        >
          Back to Ecopontos
        </button>
      </div>
    );
  }

  return (
    <div>
      {isEditMode ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Edit Ecoponto #{ecoponto.id}</h2>
          <button
            onClick={() => onNavigate("ecopontos")}
            style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <h2 style={{ marginTop: 0 }}>Add Ecoponto</h2>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          Código
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ecoponto code"
          />
        </label>
        <label>
          Tipo Ecoponto ID
          <input
            value={tipoEcopontoId}
            onChange={(e) => setTipoEcopontoId(e.target.value)}
            placeholder="Tipo Ecoponto ID"
          />
        </label>
        <label>
          Depósito ID
          <input
            value={depositoId}
            onChange={(e) => setDepositoId(e.target.value)}
            placeholder="Depósito ID"
          />
        </label>
        <label>
          Capacidade Atual
          <input
            value={capacidadeAtual}
            onChange={(e) => setCapacidadeAtual(e.target.value)}
            placeholder="Capacidade atual"
          />
        </label>
        <label>
          Latitude
          <input
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Latitude"
          />
        </label>
        <label>
          Longitude
          <input
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Longitude"
          />
        </label>
        <label>
          Descrição
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            rows={4}
          />
        </label>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          {isEditMode ? "Save Changes" : "Create Ecoponto"}
        </button>
      </form>

      {status && (
        <div
          style={{
            marginTop: 12,
            color: status.startsWith("Error") ? "#b91c1c" : "#166534",
          }}
        >
          {status}
        </div>
      )}
    </div>
  );
}
