import useModel from "../../middleware/use";
import { apiRequest } from "../../middleware/request";

export default function useEquipamentos(filters = null) {
  const { model, loading, error, refetch } = useModel("equipamento", filters);
  return {
    items: model,
    loading,
    error,
    refetch,
  };
}