/**
 * Formats an array of ponto objects into a coordinate string
 * @param {Array} pontos - Array of ponto objects with latitude and longitude properties
 * @returns {string} Formatted coordinate string in format "lat1,lng1/lat2,lng2/..."
 */
export function formatCoordinates(pontos) {
  if (!Array.isArray(pontos) || pontos.length === 0) {
    return "";
  }

  return pontos
    .map((ponto) => {
      const lat = ponto.latitude ?? ponto.coords?.[0];
      const lng = ponto.longitude ?? ponto.coords?.[1];
      
      if (lat !== undefined && lng !== undefined) {
        return `${lat},${lng}`;
      }
      return null;
    })
    .filter(Boolean)
    .join("/");
}

