import { useEffect, useState, useCallback } from "react";

export default function useEquipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEquipamentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3000/equipamento/listar");

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
