import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { apiRequest } from "../../middleware/request";
import useEmpresas from "../Empresa/useEmpresas.js";
import FormTemplate from "../FormTemplate.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function EquipamentoForm({ equipamento, onNavigate }) {
  const { authUser } = useAuth();
  const isAdmin = authUser?.cargo === 1;

  const [codigo, setCodigo] = useState("");
  const [ativo, setAtivo] = useState({ value: "true", label: "Sim" });
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
          empresaId: empresaId ? Number(empresaId.value) : null,
        }
      : {
          codigo,
          ativo: ativo?.value === "true",
          empresaId: empresaId ? Number(empresaId.value) : null,
        };

    try {
      const endpoint = isEditMode
        ? `/equipamento/atualizar/${equipamento.id}`
        : `/equipamento/inserir`;

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

      {isAdmin &&(
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
      )}
    </FormTemplate>
  );
}
