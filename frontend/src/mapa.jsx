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
import { formatCoordinates } from "./middleware/coordinatesHelper.js";
import { apiRequest } from "./middleware/request.js";
import useEmpresas from './backoffice/Empresa/useEmpresas.js';

export default function Mapa() {
  const [pontos, setPontos] = useState([]);
  const pontosCheios = pontos.filter((p) => p.percentagem > 70);
  const { items: empresas = [] } = useEmpresas();
    useEffect(() => {
      apiRequest("/rotas/coordenadas")
        .then((data) => {
          setPontos(data);
        });
    }, []);
    pontosCheios.push(...empresas.map((e) => ({
      latitude: e.latitude,
      longitude: e.longitude,
    })));
    const coordenadas = formatCoordinates(pontosCheios);


    const handleGoogleMapsRedirect = () => {
      window.open(`https://www.google.com/maps/dir/${coordenadas}`);
    };
  return (
    <>
      <button 
        onClick={handleGoogleMapsRedirect}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          padding: "10px 15px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold"
        }}
      >
        Open Google Maps
      </button>
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
    </>
  );
}
