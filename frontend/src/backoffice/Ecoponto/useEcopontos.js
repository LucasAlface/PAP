import { useEffect, useState, useCallback } from "react";

export default function useEcopontos() {
  const [ecopontos, setEcopontos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEcopontos = useCallback(async (filters = null) => {
    try {
      setLoading(true);
      setError(null);

      let url = "http://localhost:3000/ecoponto/listar";
      
      if (filters && Object.keys(filters).length > 0) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            params.append(key, value);
          }
        });
        url = `http://localhost:3000/ecoponto/listar/filtro?${params.toString()}`;
      }

      const res = await fetch(url);

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
