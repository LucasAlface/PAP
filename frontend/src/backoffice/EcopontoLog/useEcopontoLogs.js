import useModel from "../../middleware/use";

export default function useEcopontoLogs(filters = null) {
  const { model, loading, error, refetch } = useModel("ecopontologs", filters);
  return {
    items: model,
    loading,
    error,
    refetch,
  };
}
