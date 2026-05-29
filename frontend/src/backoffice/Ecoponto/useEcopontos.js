import { useEffect, useState, useCallback } from "react";

export default function useEcopontos() {
  const [ecopontos, setEcopontos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEcopontos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3000/ecoponto/listar");

      if (!res.ok) {
        throw new Error("Erro ao buscar ecopontos");
      }

      const data = await res.json();
      setEcopontos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEcopontos();
  }, [fetchEcopontos]);

  return {
    ecopontos,
    loading,
    error,
    refetch: fetchEcopontos,
  };
}

export async function filterEcopontosByCodigo(codigo) {
  try {
    const res = await fetch(`http://localhost:3000/ecoponto/listar/filtro?filtro=${codigo}`);

    if (!res.ok) {
      throw new Error("Erro ao filtrar ecopontos");
    }

    const data = await res.json();
    return data.total || [];
  } catch (err) {
    console.error("Error filtering ecopontos:", err);
    return [];
  }
}
