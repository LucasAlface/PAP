const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getChangedModel(endpoint, method) {
  const normalizedMethod = String(method).toUpperCase();

  if (!["POST", "PUT", "PATCH", "DELETE"].includes(normalizedMethod)) {
    return null;
  }

  const [path] = String(endpoint).split("?");
  const [, modelName, action] = path.split("/");

  if (!modelName || !["inserir", "atualizar", "apagar"].includes(action)) {
    return null;
  }

  return modelName;
}

function notifyModelChanged(modelName) {
  if (!modelName || typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent("model:changed", {
    detail: { modelName }
  }));
}

export async function apiRequest(endpoint, method = "GET", payload = null) {
  const options = {
    method,
    credentials: "include",
  };

  if (payload != null) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${API}${endpoint}`, options);

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    const text = await response.text();
    let errMsg = text;
    if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(text);
        errMsg = json.erro || json.error || JSON.stringify(json);
      } catch {}
    }
    throw new Error(errMsg || `Request failed with status ${response.status}`);
  }

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  notifyModelChanged(getChangedModel(endpoint, method));

  return data;
}
