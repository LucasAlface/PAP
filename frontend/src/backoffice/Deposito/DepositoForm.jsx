import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { apiRequest } from "../../middleware/request";
import useTipoDepositos from "../TipoDeposito/useTipoDepositos.js";
import useEmpresas from "../Empresa/useEmpresas.js";
import FormTemplate from "../FormTemplate.jsx";

export default function DepositoForm({ deposito, onNavigate }) {
  const { items: tipoDepositos = [] } = useTipoDepositos();
  const { items: empresas = [] } = useEmpresas();

  const tipoDepositoOptions = useMemo(() => tipoDepositos.map((d) => ({ value: String(d.id), label: d.tipo })), [tipoDepositos]);
  const empresaOptions = useMemo(() => empresas.map((d) => ({ value: String(d.id), label: d.nome })), [empresas]);

  const [capacidadeTotal, setCapacidadeTotal] = useState("");
  const [altura, setAltura] = useState("");
  const [tipoDepositoId, setTipoDepositoId] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");
  const [empresaId, setEmpresaId] = useState(null);

  const isEditMode = !!deposito;

  useEffect(() => {
    if (isEditMode && deposito) {
      setCapacidadeTotal(deposito.capacidadeTotal ?? "");
      setAltura(deposito.altura ?? "");
      setDescricao(deposito.descricao ?? "");
      setEmpresaId(null);
    }
  }, [deposito, isEditMode]);


  useEffect(() => {
    if (isEditMode && deposito) {
      const matchingOption = tipoDepositoOptions.find(
        (opt) => opt.value === String(deposito.tipoDepositoId)
      );
      setTipoDepositoId(matchingOption || null);
      const e = empresaOptions.find((o) => o.value === String(deposito.empresaId));
      setEmpresaId(e || null);
    }
  }, [tipoDepositoOptions, deposito, empresaOptions, isEditMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    if (isEditMode && !deposito?.id) {
      setStatus("Unable to update: missing depósito information.");
      return;
    }

    const payload = {
      capacidadeTotal: capacidadeTotal ? Number(capacidadeTotal) : null,
      altura: altura ? Number(altura) : null,
      tipoDepositoId: tipoDepositoId ? Number(tipoDepositoId.value) : null,
      descricao,
      empresaId: empresaId ? Number(empresaId.value) : null,
    };

    try {
      const endpoint = isEditMode
        ? `/deposito/atualizar/${deposito.id}`
        : `/deposito/inserir`;

      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : payload;

      await apiRequest(endpoint, method, requestData);

      if (isEditMode) {
        setStatus("Depósito updated successfully.");
        if (onNavigate) onNavigate("depositos");
      } else {
        setStatus("Depósito added successfully.");
        setCapacidadeTotal("");
        setAltura("");
        setTipoDepositoId(null);
        setDescricao("");
          setEmpresaId(null);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <FormTemplate
      isEditMode={isEditMode}
      entityName="Depósito"
      entityId={deposito?.id}
      hasEntity={!!deposito}
      onCancel={() => onNavigate("depositos")}
      onSubmit={handleSubmit}
      status={status}
      backLabel="Back to Depósitos"
    >
      <label>
        Capacidade Total
        <input
          type="number"
          value={capacidadeTotal}
          onChange={(e) => setCapacidadeTotal(e.target.value)}
          placeholder="Capacidade total"
        />
      </label>
      <label>
        Altura
        <input
          type="number"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Altura"
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
        Tipo Depósito
        <Select
          options={tipoDepositoOptions}
          value={tipoDepositoId}
          onChange={setTipoDepositoId}
          isSearchable={true}
          isClearable={false}
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
    </FormTemplate>
  );
}
