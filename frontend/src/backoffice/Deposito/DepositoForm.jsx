import { useEffect, useState } from "react";
import Select from "react-select";
import { apiRequest } from "../../middleware/request";

export default function DepositoForm({ deposito, onNavigate }) {
  const [capacidadeTotal, setCapacidadeTotal] = useState("");
  const [altura, setAltura] = useState("");
  const [tipoDepositoId, setTipoDepositoId] = useState(null);
  const [tipoDepositoOptions, setTipoDepositoOptions] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");

  const isEditMode = !!deposito;

  useEffect(() => {
    if (isEditMode && deposito) {
      setCapacidadeTotal(deposito.capacidadeTotal ?? "");
      setAltura(deposito.altura ?? "");
      setDescricao(deposito.descricao ?? "");
    }
  }, [deposito, isEditMode]);

  useEffect(() => {
    async function loadOptions() {
      try {
        const res = await fetch("http://localhost:3000/tipodeposito/listar");
        const data = await res.json();
        setTipoDepositoOptions(data.map((d) => ({ value: String(d.id), label: d.tipo })));
      } catch (err) {
        // ignore
      }
    }

    loadOptions();
  }, []);

  useEffect(() => {
    if (isEditMode && deposito && tipoDepositoOptions.length > 0) {
      const matchingOption = tipoDepositoOptions.find(
        (opt) => opt.value === String(deposito.tipoDepositoId)
      );
      setTipoDepositoId(matchingOption || null);
    }
  }, [tipoDepositoOptions, deposito, isEditMode]);

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
    };

    try {
      const endpoint = isEditMode
        ? `http://localhost:3000/deposito/atualizar/${deposito.id}`
        : "http://localhost:3000/deposito/inserir";

      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : [payload];

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
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  if (isEditMode && !deposito) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Depósito</h2>
        <p style={{ color: "#b91c1c" }}>No depósito selected.</p>
        <button
          onClick={() => onNavigate("depositos")}
          style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
        >
          Back to Depósitos
        </button>
      </div>
    );
  }

  return (
    <div>
      {isEditMode ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Edit Depósito #{deposito.id}</h2>
          <button
            onClick={() => onNavigate("depositos")}
            style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <h2 style={{ marginTop: 0 }}>Add Depósito</h2>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
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
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          {isEditMode ? "Save Changes" : "Create Depósito"}
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
