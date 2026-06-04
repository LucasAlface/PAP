import useModel from "../../middleware/use";
import { apiRequest } from "../../middleware/request";

export default function useTipoDepositos(filters = null) {
  const { model, loading, error, refetch } = useModel("tipodeposito", filters);
  return {
    items: model,
    loading,
    error,
    refetch,
  };
}