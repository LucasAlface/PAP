import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { apiRequest } from "../../middleware/request";
import useEmpresas from "../Empresa/useEmpresas.js";
import FormTemplate from "../FormTemplate.jsx";

export default function EquipamentoForm({ equipamento, onNavigate }) {
  const [codigo, setCodigo] = useState("");
  const [ativo, setAtivo] = useState({ value: "true", label: "Sim" });
  const [bateria, setBateria] = useState("");
  const [status, setStatus] = useState("");
  const { items: empresas = [] } = useEmpresas();
  const [empresaId, setEmpresaId] = useState(null);

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
      setEmpresaId(null);
    }
  }, [equipamento, isEditMode]);

  const empresaOptions = useMemo(() => empresas.map((d) => ({ value: String(d.id), label: d.nome })), [empresas]);
  useEffect(() => {
    if (isEditMode && equipamento) {
      const e = empresaOptions.find((o) => o.value === String(equipamento.empresaId));
      setEmpresaId(e || null);
    }
  }, [empresaOptions, equipamento, isEditMode]);

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
          empresaId: empresaId ? Number(empresaId.value) : null,
        }
      : {
          codigo,
          ativo: ativo?.value === "true",
          empresaId: empresaId ? Number(empresaId.value) : null,
        };

    try {
      const endpoint = isEditMode
        ? `http://localhost:3000/equipamento/atualizar/${equipamento.id}`
        : "http://localhost:3000/equipamento/inserir";

      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : payload;

      await apiRequest(endpoint, method, requestData);

      if (isEditMode) {
        setStatus("Equipamento updated successfully.");
        if (onNavigate) onNavigate("equipamentos");
      } else {
        setStatus("Equipamento added successfully.");
        setCodigo("");
        setAtivo({ value: "true", label: "Sim" });
        setBateria("");
          setEmpresaId(null);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <FormTemplate
      isEditMode={isEditMode}
      entityName="Equipamento"
      entityId={equipamento?.id}
      hasEntity={!!equipamento}
      onCancel={() => onNavigate("equipamentos")}
      onSubmit={handleSubmit}
      status={status}
    >
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
    </FormTemplate>
  );
}
