export async function apiRequest(url, method, payload) {
  const res = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  console.log(res.status);
console.log(res.ok);

  if (!res.ok) {
    const errorPayload = await res.json();
    throw new Error(errorPayload.erro || "Request failed");
  }

  return res;
}