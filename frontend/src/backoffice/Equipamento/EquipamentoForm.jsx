import { useEffect, useState } from "react";
import Select from "react-select";

export default function EquipamentoForm({ equipamento, onNavigate }) {
  const [codigo, setCodigo] = useState("");
  const [ativo, setAtivo] = useState(null);
  const [bateria, setBateria] = useState("");
  const [status, setStatus] = useState("");

  const isEditMode = !!equipamento;

  const options = [
    { value: "true", label: "Sim" },
    { value: "false", label: "Não" },
  ];

  useEffect(() => {
    if (isEditMode && equipamento) {
      setCodigo(equipamento.codigo ?? "");
      setAtivo(
        equipamento.ativo
          ? { value: "true", label: "Sim" }
          : { value: "false", label: "Não" }
      );
      setBateria(equipamento.bateria ?? "");
    }
  }, [equipamento, isEditMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    if (isEditMode && !equipamento?.id) {
      setStatus("Unable to update: missing equipamento information.");
      return;
    }

    const payload = isEditMode
      ? {
          codigo,
          ativo: ativo?.value === "true",
          bateria: bateria ? Number(bateria) : null,
        }
      : {
          codigo,
          ativo: ativo?.value === "true",
        };

    try {
      const endpoint = isEditMode
        ? `http://localhost:3000/equipamento/atualizar/${equipamento.id}`
        : "http://localhost:3000/equipamento/inserir";

      const method = isEditMode ? "PUT" : "POST";
      const body = isEditMode ? JSON.stringify(payload) : JSON.stringify([payload]);

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const errorPayload = await res.json();
        throw new Error(errorPayload.erro || "Failed to save equipamento");
      }

      if (isEditMode) {
        setStatus("Equipamento updated successfully.");
        if (onNavigate) onNavigate("equipamentos");
      } else {
        setStatus("Equipamento added successfully.");
        setCodigo("");
        setAtivo(null);
        setBateria("");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  if (isEditMode && !equipamento) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Equipamento</h2>
        <p style={{ color: "#b91c1c" }}>No equipamento selected.</p>
        <button
          onClick={() => onNavigate("equipamentos")}
          style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
        >
          Back to Equipamentos
        </button>
      </div>
    );
  }

  return (
    <div>
      {isEditMode ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Edit Equipamento #{equipamento.id}</h2>
          <button
            onClick={() => onNavigate("equipamentos")}
            style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <h2 style={{ marginTop: 0 }}>Add Equipamento</h2>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          Código
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Equipamento code"
          />
        </label>

        <label>
          Ativo
          <Select
            options={options}
            value={ativo}
            onChange={setAtivo}
            isSearchable={true}
            isClearable={false}
          />
        </label>

        {isEditMode && (
          <label>
            Bateria
            <input
              type="number"
              value={bateria}
              onChange={(e) => setBateria(e.target.value)}
              placeholder="Bateria"
            />
          </label>
        )}

        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          {isEditMode ? "Save Changes" : "Create Equipamento"}
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
