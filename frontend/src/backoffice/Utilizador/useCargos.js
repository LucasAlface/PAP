import useModel from "../../middleware/use";
import { apiRequest } from "../../middleware/request";

export default function useCargos(filters = null) {
  const { model, loading, error, refetch } = useModel("cargo", filters);
  return {
    items: model,
    loading,
    error,
    refetch,
  };
}