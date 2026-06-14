import useTipoEcopontos from "./useTipoEcopontos.js";
import ListTemplate from "../ListTemplate.jsx";

export default function TipoEcopontos({ onNavigate }) {
  const { items: tipoEcopontos, loading, error } = useTipoEcopontos();

  const columns = [
    { key: "tipo", label: "Tipo" },
    { key: "descricao", label: "Descrição" },
  ];

  return (
    <ListTemplate
      title="Tipo Ecopontos"
      addLabel="Add Tipo Ecoponto"
      onAdd={() => onNavigate("add-tipoecoponto")}
      loading={loading}
      error={error}
      items={tipoEcopontos}
      totalLabel="Total de tipo ecopontos"
      emptyMessage="No tipo ecopontos found."
      columns={columns}
      getRowKey={(item) => item.id}
      onEdit={(item) => onNavigate("edit-tipoecoponto", item)}
      onDelete={(item) => onNavigate("delete-tipoecoponto", item)}
    />
  );
}
