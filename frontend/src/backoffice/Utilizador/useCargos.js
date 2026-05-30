import { useEffect, useState, useCallback } from "react";

export default function useCargos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCargos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3000/cargo/listar");
      if (!res.ok) {
        throw new Error("Erro ao buscar cargos");
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
    fetchCargos();
  }, [fetchCargos]);

  return {
    items,
    loading,
    error,
    refetch: fetchCargos,
  };
}
