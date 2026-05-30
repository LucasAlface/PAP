import { useEffect, useState, useCallback } from "react";

export default function useUtilizadores() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUtilizadores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3000/utilizador/listar");
      if (!res.ok) {
        throw new Error("Erro ao buscar utilizadores");
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUtilizadores();
  }, [fetchUtilizadores]);

  return {
    items,
    loading,
    error,
    refetch: fetchUtilizadores,
  };
}
