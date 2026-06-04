import useModel from "../../middleware/use";
import { apiRequest } from "../../middleware/request";

export default function useDepositos(filters = null) {
  const { model, loading, error, refetch } = useModel("deposito", filters);
  return {
    items: model,
    loading,
    error,
    refetch,
  };
}