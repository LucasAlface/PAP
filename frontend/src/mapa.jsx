import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige problema dos ícones no React/Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Mapa() {
  // Lista de pontos
  const pontos = [
    {
      id: 1,
      nome: "Lisboa",
      coords: [38.7223, -9.1393],
    },
    {
      id: 2,
      nome: "Porto",
      coords: [41.1579, -8.6291],
    },
  ];

  return (
    <MapContainer
      center={[39.5, -8]}
      zoom={6}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pontos.map((ponto) => (
        <Marker key={ponto.id} position={ponto.coords}>
          <Popup>{ponto.nome}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}