export function getDistance(a, b) {
  const R = 6371000; // raio da terra (m)

  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) *
    Math.cos(b.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formatCoordinates(pontos, tolerance = 5) {
  if (!Array.isArray(pontos) || pontos.length === 0) {
    return "";
  }

  const unique = [];

  pontos.forEach((ponto) => {
    const lat = ponto.latitude ?? ponto.coords?.[0];
    const lng = ponto.longitude ?? ponto.coords?.[1];

    if (lat == null || lng == null) return;

    const exists = unique.some((existing) =>
      getDistance(
        { lat, lng },
        existing
      ) <= tolerance
    );

    if (!exists) {
      unique.push({ lat, lng });
    }
  });

  return unique
    .map((p) => `${p.lat},${p.lng}`)
    .join("|");
}
