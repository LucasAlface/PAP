import { useEffect, useState, useCallback } from "react";

export default function useDepositos() {
  const [depositos, setDepositos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepositos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3000/deposito/listar");

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