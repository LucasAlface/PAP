import { MapContainer, TileLayer } from "react-leaflet";
import Routing from "./Routing";

export default function App() {
  return (
    <MapContainer
      center={[39.5, -8]}
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Routing />
    </MapContainer>
  );
}