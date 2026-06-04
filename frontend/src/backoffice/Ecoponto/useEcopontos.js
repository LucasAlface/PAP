import useModel from "../../middleware/use";
import { apiRequest } from "../../middleware/request";

export default function useEcopontos(filters = null) {
  const { model, loading, error, refetch } = useModel("ecoponto", filters);
  return {
    items: model,
    loading,
    error,
    refetch,
  };
}
