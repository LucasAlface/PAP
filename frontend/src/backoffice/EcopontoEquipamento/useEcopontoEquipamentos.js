import useModel from "../../middleware/use";
import { apiRequest } from "../../middleware/request";

export default function useEcopontoEquipamentos(filters = null) {
  const { model, loading, error, refetch } = useModel("ecopontoequipamento", filters);
  return {
    items: model,
    loading,
    error,
    refetch,
  };
}