import { ArrowLeft, Pencil, Plus, Save, X } from "lucide-react";

export default function FormTemplate({
  isEditMode,
  entityName,
  entityId,
  hasEntity,
  onCancel,
  onSubmit,
  submitLabel,
  cancelLabel = "Cancelar",
  backLabel,
  status,
  children,
}) {
  const resolvedBackLabel = backLabel || `Back to ${entityName}s`;
  const title = isEditMode ? `Editar ${entityName} #${entityId}` : `Adicionar ${entityName}`;
  const ButtonIcon = isEditMode ? Save : Plus;

  if (isEditMode && !hasEntity) {
    return (
      <div className="form-template">
        <div className="template-header">
          <div>
            <span className="template-kicker">Seleção em falta</span>
            <h2>Editar {entityName}</h2>
          </div>
        </div>
        <p className="template-error">Nenhum {entityName.toLowerCase()} selecionado.</p>
        <button type="button" onClick={onCancel} className="bo-btn bo-btn-primary">
          <ArrowLeft size={16} />
          {resolvedBackLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="form-template">
      <div className="template-header">
        <div>
          <span className="template-kicker">{isEditMode ? "Editar registo" : "Novo registo"}</span>
          <h2>{title}</h2>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bo-btn bo-btn-ghost">
            <X size={16} />
            {cancelLabel}
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="bo-form">
        {children}
        <button type="submit" className="bo-btn bo-btn-primary bo-submit">
          <ButtonIcon size={16} />
          {submitLabel || (isEditMode ? "Guardar alterações" : `Criar ${entityName}`)}
        </button>
      </form>

      {status && (
        <div
          className={`template-status ${status.startsWith("Error") ? "is-error" : "is-success"}`}
        >
          {status.startsWith("Error") ? <X size={16} /> : <Pencil size={16} />}
          {status}
        </div>
      )}
    </div>
  );
}
