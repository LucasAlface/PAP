import { useEffect, useState, useCallback } from "react";

export default function useEquipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEquipamentos = useCallback(async (filters = null) => {
    try {
      setLoading(true);
      setError(null);

      let url = "http://localhost:3000/equipamento/listar";
      
      if (filters && Object.keys(filters).length > 0) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            params.append(key, value);
          }
        });
        url = `http://localhost:3000/equipamento/listar/filtro?${params.toString()}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Erro ao buscar equipamentos");
      }

      const data = await res.json();
      setEquipamentos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipamentos();
  }, [fetchEquipamentos]);

  return {
    equipamentos,
    loading,
    error,
    refetch: fetchEquipamentos,
  };
}
