import { useEffect, useState, useCallback } from "react";

export default function useTipoDepositos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async (filters = null) => {
    try {
      setLoading(true);
      setError(null);

      let url = "http://localhost:3000/tipodeposito/listar";
      
      if (filters && Object.keys(filters).length > 0) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            params.append(key, value);
          }
        });
        url = `http://localhost:3000/tipodeposito/listar/filtro?${params.toString()}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Erro ao buscar tipo depósitos");
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
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
  };
}
