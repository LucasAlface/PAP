import { useEffect, useState, useMemo } from "react";
import { apiRequest } from "../../middleware/request";
import Select from "react-select";
import useEcopontos from "../Ecoponto/useEcopontos.js";
import useEquipamentos from "../Equipamento/useEquipamentos.js";
import useEmpresas from "../Empresa/useEmpresas.js";

export default function EcopontoEquipamentoForm({ ecopontoEquipamento, onNavigate }) {
  const { items: ecopontos = [] } = useEcopontos();
  const { items: equipamentos = [] } = useEquipamentos();
  const { items: empresas = [] } = useEmpresas();

  const ecopontoOptions = useMemo(() => ecopontos.map((e) => ({ value: String(e.id), label: `${e.codigo} - ${e.descricao || ""}` })), [ecopontos]);
  const equipamentoOptions = useMemo(() => equipamentos.map((eq) => ({ value: String(eq.id), label: `${eq.codigo} - ${eq.descricao || ""}` })), [equipamentos]);
  const empresaOptions = useMemo(() => empresas.map((d) => ({ value: String(d.id), label: d.nome })), [empresas]);

  const [ecopontoId, setEcopontoId] = useState(null);
  const [equipamentoId, setEquipamentoId] = useState(null);
  const [ativo, setAtivo] = useState({ value: "true", label: "Sim" });
  const [status, setStatus] = useState("");
  const [empresaId, setEmpresaId] = useState(null);

  const options = [
    { value: "true", label: "Sim" },
    { value: "false", label: "Não" },
  ];

  const isEditMode = !!ecopontoEquipamento;

  useEffect(() => {
    if (isEditMode && ecopontoEquipamento) {
      setAtivo(ecopontoEquipamento.ativo ? options[0] : options[1]);

      const eOpt = ecopontoOptions.find((o) => o.value === String(ecopontoEquipamento.ecopontoId));
      const eqOpt = equipamentoOptions.find((o) => o.value === String(ecopontoEquipamento.equipamentoId));
      setEcopontoId(eOpt || null);
      setEquipamentoId(eqOpt || null);
      const empOpt = empresaOptions.find((o) => o.value === String(ecopontoEquipamento.empresaId));
      setEmpresaId(empOpt || null);
    } else if (!isEditMode) {
      setEcopontoId(null);
      setEquipamentoId(null);
      setAtivo(options[0]);
      setEmpresaId(null);
    }
  }, [ecopontoEquipamento, ecopontoOptions, equipamentoOptions, empresaOptions, isEditMode]);
  

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    if (isEditMode && (!ecopontoEquipamento?.ecopontoId || !ecopontoEquipamento?.equipamentoId)) {
      setStatus("Unable to update: missing ecoponto equipamento information.");
      return;
    }

    const payload = isEditMode
      ? { ativo: ativo?.value === "true", empresaId: empresaId ? Number(empresaId.value) : null }
      : 
          {
            ecopontoId: ecopontoId ? Number(ecopontoId.value) : null,
            equipamentoId: equipamentoId ? Number(equipamentoId.value) : null,
            ativo: ativo?.value === "true",
            empresaId: empresaId ? Number(empresaId.value) : null,
          }
        ;

    const endpoint = isEditMode
      ? `http://localhost:3000/ecopontoequipamento/atualizar/${ecopontoEquipamento.ecopontoId}/${ecopontoEquipamento.equipamentoId}`
      : "http://localhost:3000/ecopontoequipamento/inserir";

    const method = isEditMode ? "PUT" : "POST";

    try {
      await apiRequest(endpoint, method, payload);

      if (isEditMode) {
        setStatus("Ecoponto Equipamento updated successfully.");
        if (onNavigate) onNavigate("ecopontoequipamentos");
      } else {
        setStatus("Ecoponto Equipamento added successfully.");
        setEcopontoId(null);
        setEquipamentoId(null);
        setAtivo(options[0]);
        setEmpresaId(null);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
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
          Ecoponto
          <Select
            options={ecopontoOptions}
            value={ecopontoId}
            onChange={setEcopontoId}
            isSearchable={true}
            isClearable={false}
            isDisabled={isEditMode}
            placeholder="Select Ecoponto"
          />
        </label>

        <label>
          Equipamento
          <Select
            options={equipamentoOptions}
            value={equipamentoId}
            onChange={setEquipamentoId}
            isSearchable={true}
            isClearable={false}
            isDisabled={isEditMode}
            placeholder="Select Equipamento"
          />
        </label>

        <label>
          Empresa
          <Select
            options={empresaOptions}
            value={empresaId}
            onChange={setEmpresaId}
            isSearchable={true}
            isClearable={false}
          />
        </label>

        <label>
          Ativo
          <Select options={options} value={ativo} onChange={setAtivo} isSearchable isClearable={false} />
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
