import useModel from "../../middleware/use";
import { apiRequest } from "../../middleware/request";

export default function useTipoEcopontos(filters = null) {
  const { model, loading, error, refetch } = useModel("tipoecoponto", filters);
  return {
    items: model,
    loading,
    error,
    refetch,
  };
}