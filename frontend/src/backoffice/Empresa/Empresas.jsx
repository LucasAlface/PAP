import useEmpresas from './useEmpresas.js';
import ListTemplate from "../ListTemplate.jsx";

export default function Empresas({ onNavigate }) {
  const { items: empresas, loading, error } = useEmpresas();

  const columns = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome" },
    { key: "nif", label: "NIF" },
    { key: "email", label: "Email" },
    { key: "telefone", label: "Telefone" },
  ];

  return (
    <ListTemplate
      title="Empresas"
      addLabel="Add Empresa"
      onAdd={() => onNavigate("add-empresa")}
      loading={loading}
      error={error}
      items={empresas}
      totalLabel="Total de empresas"
      emptyMessage="No empresas found."
      columns={columns}
      getRowKey={(item) => item.id}
      onEdit={(item) => onNavigate("edit-empresa", item)}
      onDelete={(item) => onNavigate("delete-empresa", item)}
    />
  );
}