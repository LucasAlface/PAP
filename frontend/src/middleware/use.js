import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "./request";

export default function useModel(modelName, filters = null) {
  const [model, setModel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchModel = useCallback(
    async (filtersToUse = filters) => {
      try {
        setLoading(true);
        setError(null);

        let endpoint = `/${modelName}/listar`;

        if (filtersToUse && Object.keys(filtersToUse).length > 0) {
          const params = new URLSearchParams();
          Object.entries(filtersToUse).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
              params.append(key, value);
            }
          });
          endpoint = `/${modelName}/listar/filtro?${params.toString()}`;
        }

        const data = await apiRequest(endpoint, "GET");
        setModel(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [modelName, filters]
  );

  useEffect(() => {
    fetchModel(filters);
  }, [fetchModel, filters]);

  useEffect(() => {
    const handleModelChanged = (event) => {
      if (event.detail?.modelName === modelName) {
        fetchModel(filters);
      }
    };

    window.addEventListener("model:changed", handleModelChanged);

    return () => {
      window.removeEventListener("model:changed", handleModelChanged);
    };
  }, [fetchModel, filters, modelName]);

  return {
    model,
    loading,
    error,
    refetch: fetchModel,
  };
}
