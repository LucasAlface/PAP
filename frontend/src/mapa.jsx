import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";
import Routing from "./routing.jsx";

export default function Mapa() {
  const [pontos, setPontos] = useState([]);
  const pontosCheios = pontos.filter((p) => p.percentagem > 70);
  
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
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pontos.map((ponto) => (
        <Marker
          key={ponto.codigo}
          position={[
            Number(ponto.latitude),
            Number(ponto.longitude),
          ]}
        >
          <Popup>
            <div>Ecoponto {ponto.codigo}</div>
          </Popup>
          <Tooltip permanent direction="bottom" offset={[0, 10]}>
            {ponto.percentagem}%
          </Tooltip>
        </Marker>
      ))}
      <Routing pontos={pontosCheios} />
    </MapContainer>
  );
}