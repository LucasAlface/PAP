import useModel from "../../middleware/use";
import { apiRequest } from "../../middleware/request";

export default function useUtilizadores(filters = null) {
  const { model, loading, error, refetch } = useModel("utilizador", filters);
  return {
    items: model,
    loading,
    error,
    refetch,
  };
}