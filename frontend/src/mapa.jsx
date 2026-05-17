import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import Routing from "./routing.jsx";

export default function Mapa() {
  const [pontos, setPontos] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:3000/rotas/coordenadas")
        .then((res) => res.json())
        .then((data) => {
          setPontos(data);
        });
    }, []);
  return (
    <MapContainer
      center={[40.6, -8.6]}
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pontos.map((ponto, index) => (
        <Marker
          key={index}
          position={[
            Number(ponto.latitude),
            Number(ponto.longitude),
          ]}
        >
          <Popup>
            Ponto {index + 1}
          </Popup>
        </Marker>
      ))}
      <Routing pontos={pontos} />
    </MapContainer>
  );
}