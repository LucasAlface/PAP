import { useEffect, useState } from "react";
import Select from "react-select";

export default function EcopontoEquipamentoForm({
  ecopontoEquipamento,
  onNavigate,
}) {
  const [ecopontoId, setEcopontoId] = useState("");
  const [equipamentoId, setEquipamentoId] = useState("");
  const [ativo, setAtivo] = useState("true");
  const [status, setStatus] = useState("");
  const options = [
    { value: "true", label: "Sim" },
    { value: "false", label: "Não" },
  ];

  const isEditMode = !!ecopontoEquipamento;

  useEffect(() => {
    if (isEditMode && ecopontoEquipamento) {
      setEcopontoId(ecopontoEquipamento.ecopontoId ?? "");
      setEquipamentoId(ecopontoEquipamento.equipamentoId ?? "");
      setAtivo(ecopontoEquipamento.ativo ? "true" : "false");
    }
  }, [ecopontoEquipamento, isEditMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    if (isEditMode) {
      if (!ecopontoEquipamento?.ecopontoId || !ecopontoEquipamento?.equipamentoId) {
        setStatus("Unable to update: missing ecoponto equipamento information.");
        return;
      }

      const payload = {
        ativo: ativo === "true",
      };

      try {
        const res = await fetch(
          `http://localhost:3000/ecopontoequipamento/atualizar/${ecopontoEquipamento.ecopontoId}/${ecopontoEquipamento.equipamentoId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const errorPayload = await res.json();
          throw new Error(
            errorPayload.erro || "Failed to update ecoponto equipamento"
          );
        }

        setStatus("Ecoponto Equipamento updated successfully.");
        if (onNavigate) onNavigate("ecopontoequipamentos");
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    } else {
      const payload = [
        {
          ecopontoId: ecopontoId ? Number(ecopontoId) : null,
          equipamentoId: equipamentoId ? Number(equipamentoId) : null,
          ativo: ativo === "true",
        },
      ];

      try {
        const res = await fetch(
          "http://localhost:3000/ecopontoequipamento/inserir",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const errorPayload = await res.json();
          throw new Error(
            errorPayload.erro || "Failed to add ecoponto equipamento"
          );
        }

        setStatus("Ecoponto Equipamento added successfully.");
        setEcopontoId("");
        setEquipamentoId("");
        setAtivo("true");
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    }
  }

  if (isEditMode && !ecopontoEquipamento) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Ecoponto Equipamento</h2>
        <p style={{ color: "#b91c1c" }}>No ecoponto equipamento selected.</p>
        <button
          onClick={() => onNavigate("ecopontoequipamentos")}
          style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
        >
          Back to Ecoponto Equipamentos
        </button>
      </div>
    );
  }

  return (
    <div>
      {isEditMode ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Edit Ecoponto Equipamento</h2>
          <button
            onClick={() => onNavigate("ecopontoequipamentos")}
            style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <h2 style={{ marginTop: 0 }}>Add Ecoponto Equipamento</h2>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          Ecoponto ID
          <input
            type="number"
            value={ecopontoId}
            onChange={(e) => setEcopontoId(e.target.value)}
            placeholder="Ecoponto ID"
            disabled={isEditMode}
          />
        </label>
        <label>
          Equipamento ID
          <input
            type="number"
            value={equipamentoId}
            onChange={(e) => setEquipamentoId(e.target.value)}
            placeholder="Equipamento ID"
            disabled={isEditMode}
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
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          {isEditMode ? "Save Changes" : "Create Ecoponto Equipamento"}
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
