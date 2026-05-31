import { useEffect, useState } from "react";
import Select from "react-select";
import { apiRequest } from "../../middleware/request";
import useEmpresas from "../Empresa/useEmpresas.js";
import useCargos from "./useCargos.js";

export default function UtilizadorForm({ utilizador, onNavigate }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargoId, setCargoId] = useState(null);
  const [empresaId, setEmpresaId] = useState(null);
  const [status, setStatus] = useState("");

  const isEditMode = !!utilizador;
  const { items: cargos } = useCargos();
  const { items: empresas } = useEmpresas();

  const cargoOptions = cargos.map((cargo) => ({ value: String(cargo.id), label: cargo.nome || String(cargo.id) }));
  const empresaOptions = empresas.map((empresa) => ({ value: String(empresa.id), label: empresa.nome || String(empresa.id) }));

  useEffect(() => {
    if (isEditMode && utilizador) {
      setNome(utilizador.nome ?? "");
      setEmail(utilizador.email ?? "");
      setPassword("");
      setCargoId(cargoOptions.find((option) => option.value === String(utilizador.cargoId)) || null);
      setEmpresaId(empresaOptions.find((option) => option.value === String(utilizador.empresaId)) || null);
    }
  }, [utilizador, isEditMode, cargoOptions, empresaOptions]);

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

  if (isEditMode && !utilizador) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Utilizador</h2>
        <p style={{ color: "#b91c1c" }}>No utilizador selected.</p>
        <button
          onClick={() => onNavigate("utilizadores")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Back to Utilizadores
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>{isEditMode ? "Edit Utilizador" : "Add Utilizador"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
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

        <button
          type="submit"
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          {isEditMode ? "Update Utilizador" : "Add Utilizador"}
        </button>
      </form>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
