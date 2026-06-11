export default function FormTemplate({
  isEditMode,
  entityName,
  entityId,
  hasEntity,
  onCancel,
  onSubmit,
  submitLabel,
  cancelLabel = "Cancel",
  backLabel,
  status,
  children,
}) {
  const resolvedBackLabel = backLabel || `Back to ${entityName}s`;

  if (isEditMode && !hasEntity) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit {entityName}</h2>
        <p style={{ color: "#b91c1c" }}>No {entityName.toLowerCase()} selected.</p>
        <button
          onClick={onCancel}
          style={{ padding: "10px 14px", borderRadius: 6, border: "none", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          {resolvedBackLabel}
        </button>
      </div>
    );
  }

  return (
    <div>
      {isEditMode ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Edit {entityName} #{entityId}</h2>
          <button
            onClick={onCancel}
            style={{ padding: "10px 14px", borderRadius: 6, border: "none", background: "#3b82f6", color: "white", cursor: "pointer" }}
          >
            {cancelLabel}
          </button>
        </div>
      ) : (
        <h2 style={{ marginTop: 0 }}>Add {entityName}</h2>
      )}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        {children}
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, border: "none", background: "#3b82f6", color: "white", cursor: "pointer" }}>
          {submitLabel || (isEditMode ? "Save Changes" : `Create ${entityName}`)}
        </button>
      </form>

      {status && (
        <div
          style={{
            marginTop: 12,
            color: status.startsWith("Error") ? "#b91c1c" : "#166534",
          }}
        >
          {status}
        </div>
      )}
    </div>
  );
}
