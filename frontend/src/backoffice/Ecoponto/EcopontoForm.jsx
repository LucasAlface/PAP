import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { apiRequest } from "../../middleware/request";
import useTipoEcopontos from "../TipoEcoponto/useTipoEcopontos.js";
import useDepositos from "../Deposito/useDepositos.js";
import useEmpresas from "../Empresa/useEmpresas.js";
import FormTemplate from "../FormTemplate.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function EcopontoForm({ ecoponto, onNavigate }) {
  const { items: tipos = [] } = useTipoEcopontos();
  const { items: depositos = [] } = useDepositos();
  const { items: empresas = [] } = useEmpresas();

  const [codigo, setCodigo] = useState("");
  const [tipoEcopontoId, setTipoEcopontoId] = useState(null);
  const [depositoId, setDepositoId] = useState(null);
  const [capacidadeAtual, setCapacidadeAtual] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");
  const [empresaId, setEmpresaId] = useState(null);

  const isEditMode = !!ecoponto;
  const { authUser } = useAuth();
  const isAdmin = authUser?.cargo === 1;

  useEffect(() => {
    if (isEditMode && ecoponto) {
      setCodigo(ecoponto.codigo ?? "");
      setTipoEcopontoId(null);
      setDepositoId(null);
      setCapacidadeAtual(ecoponto.capacidadeAtual ?? "");
      setLatitude(ecoponto.latitude ?? "");
      setLongitude(ecoponto.longitude ?? "");
      setDescricao(ecoponto.descricao ?? "");
      setEmpresaId(null);
    }
  }, [ecoponto, isEditMode]);

  const tipoOptions = useMemo(() => tipos.map((d) => ({ value: String(d.id), label: d.tipo })), [tipos]);
  const depositoOptions = useMemo(() => depositos.map((d) => ({ value: String(d.id), label: d.descricao })), [depositos]);
  const empresaOptions = useMemo(() => empresas.map((d) => ({ value: String(d.id), label: d.nome })), [empresas]);
  useEffect(() => {
    if (isEditMode && ecoponto) {
      const t = tipoOptions.find((o) => o.value === String(ecoponto.tipoEcopontoId));
      const d = depositoOptions.find((o) => o.value === String(ecoponto.depositoId));
      const e = empresaOptions.find((o) => o.value === String(ecoponto.empresaId));
      setTipoEcopontoId(t || null);
      setDepositoId(d || null);
      setEmpresaId(e || null);
    }
  }, [tipoOptions, depositoOptions, empresaOptions, ecoponto, isEditMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    if (isEditMode && !ecoponto?.id) {
      setStatus("Unable to update: missing ecoponto information.");
      return;
    }

    const payload = {
      codigo,
      tipoEcopontoId: tipoEcopontoId ? Number(tipoEcopontoId.value) : null,
      depositoId: depositoId ? Number(depositoId.value) : null,
      capacidadeAtual: capacidadeAtual ? Number(capacidadeAtual) : null,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      descricao,
      empresaId: empresaId ? Number(empresaId.value) : null,
    };

    try {
      const endpoint = isEditMode
        ? `/ecoponto/atualizar/${ecoponto.id}`
        : `/ecoponto/inserir`;

      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : payload;

      await apiRequest(endpoint, method, requestData);

      if (isEditMode) {
        setStatus("Ecoponto updated successfully.");
        if (onNavigate) onNavigate("ecopontos");
      } else {
        setStatus("Ecoponto added successfully.");
        setCodigo("");
        setTipoEcopontoId(null);
        setDepositoId(null);
        setCapacidadeAtual("");
        setLatitude("");
        setLongitude("");
        setDescricao("");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <FormTemplate
      isEditMode={isEditMode}
      entityName="Ecoponto"
      entityId={ecoponto?.id}
      hasEntity={!!ecoponto}
      onCancel={() => onNavigate("ecopontos")}
      onSubmit={handleSubmit}
      status={status}
    >
      <label>
        Código
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ecoponto code"
        />
      </label>
      <label>
        Tipo Ecoponto
        <Select
          options={tipoOptions}
          value={tipoEcopontoId}
          onChange={setTipoEcopontoId}
          isSearchable={true}
          isClearable={false}
        />
      </label>
      <label>
        Depósito
        <Select
          options={depositoOptions}
          value={depositoId}
          onChange={setDepositoId}
          isSearchable={true}
          isClearable={false}
        />
      </label>
      {isAdmin && (
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
    </FormTemplate>
  );
}
