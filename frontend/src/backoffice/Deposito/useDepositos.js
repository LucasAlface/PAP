import { useEffect, useState, useCallback } from "react";

export default function useDepositos() {
  const [depositos, setDepositos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepositos = useCallback(async (filters = null) => {
    try {
      setLoading(true);
      setError(null);

      let url = "http://localhost:3000/deposito/listar";
      
      if (filters && Object.keys(filters).length > 0) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            params.append(key, value);
          }
        });
        url = `http://localhost:3000/deposito/listar/filtro?${params.toString()}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Erro ao buscar depósitos");
      }

      const data = await res.json();
      setDepositos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepositos();
  }, [fetchDepositos]);

  return {
    depositos,
    loading,
    error,
    refetch: fetchDepositos,
  };
}