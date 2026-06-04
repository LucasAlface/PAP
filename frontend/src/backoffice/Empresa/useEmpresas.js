import useModel from "../../middleware/use";
import { apiRequest } from "../../middleware/request";

export default function useEmpresas(filters = null) {
  const { model, loading, error, refetch } = useModel("empresa", filters);
  return {
    items: model,
    loading,
    error,
    refetch,
  };
}