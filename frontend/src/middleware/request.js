const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
}