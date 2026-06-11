import { useEffect, useState } from "react";
import Select from "react-select";
import { apiRequest } from "../../middleware/request";
import useEmpresas from "../Empresa/useEmpresas.js";
import useCargos from "./useCargos.js";
import FormTemplate from "../FormTemplate.jsx";

export default function UtilizadorForm({ utilizador, onNavigate }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargoId, setCargoId] = useState(null);
  const [empresaId, setEmpresaId] = useState(null);
  const [status, setStatus] = useState("");

  const isEditMode = !!utilizador;
  const { items: cargos = [] } = useCargos();
  const { items: empresas = [] } = useEmpresas();

  const cargoOptions = cargos.map((cargo) => ({ value: String(cargo.id), label: cargo.cargo || String(cargo.id) }));
  const empresaOptions = empresas.map((empresa) => ({ value: String(empresa.id), label: empresa.nome || String(empresa.id) }));

  useEffect(() => {
    if (isEditMode && utilizador && cargos.length > 0 && empresas.length > 0) {
      setNome(utilizador.nome ?? "");
      setEmail(utilizador.email ?? "");
      setPassword("");
      const cargoOpts = cargos.map((cargo) => ({ value: String(cargo.id), label: cargo.cargo || String(cargo.id) }));
      const empresaOpts = empresas.map((empresa) => ({ value: String(empresa.id), label: empresa.nome || String(empresa.id) }));
      setCargoId(cargoOpts.find((option) => option.value === String(utilizador.cargoId)) || null);
      setEmpresaId(empresaOpts.find((option) => option.value === String(utilizador.empresaId)) || null);
    }
  }, [utilizador?.id, cargos, empresas]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    if (isEditMode && !utilizador?.id) {
      setStatus("Unable to update: missing utilizador information.");
      return;
    }

    const payload = {
      nome,
      email,
      cargoId: cargoId ? Number(cargoId.value) : null,
      empresaId: empresaId ? Number(empresaId.value) : null,
    };

    if (!isEditMode || password) {
      payload.password = password;
    }

    if (!payload.nome || !payload.email || payload.cargoId === null) {
      setStatus("Nome, email and cargo are required.");
      return;
    }

    if (!isEditMode && !payload.password) {
      setStatus("Password is required when creating a new utilizador.");
      return;
    }

    try {
      const endpoint = isEditMode
        ? `http://localhost:3000/utilizador/atualizar/${utilizador.id}`
        : "http://localhost:3000/utilizador/inserir";
      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : payload;

      await apiRequest(endpoint, method, requestData);

      if (isEditMode) {
        setStatus("Utilizador updated successfully.");
        if (onNavigate) onNavigate("utilizadores");
      } else {
        setStatus("Utilizador added successfully.");
        setNome("");
        setEmail("");
        setPassword("");
        setCargoId(null);
        setEmpresaId(null);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <FormTemplate
      isEditMode={isEditMode}
      entityName="Utilizador"
      entityId={utilizador?.id}
      hasEntity={!!utilizador}
      onCancel={() => onNavigate("utilizadores")}
      onSubmit={handleSubmit}
      status={status}
      backLabel="Back to Utilizadores"
      submitLabel={isEditMode ? "Update Utilizador" : "Add Utilizador"}
    >
      <label>
        Nome
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isEditMode ? "Leave blank to keep current password" : "Password"}
          {...(!isEditMode ? { required: true } : {})}
        />
      </label>

      <label>
        Cargo
        <Select
          options={cargoOptions}
          value={cargoId}
          onChange={setCargoId}
          isSearchable={true}
          isClearable={false}
          placeholder="Select Cargo"
        />
      </label>

      <label>
        Empresa
        <Select
          options={empresaOptions}
          value={empresaId}
          onChange={setEmpresaId}
          isSearchable={true}
          isClearable={true}
          placeholder="Select Empresa"
        />
      </label>
    </FormTemplate>
  );
}
