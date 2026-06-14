import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Building2, Database, Recycle } from "lucide-react";
import Routing from "./routing.jsx";
import { formatCoordinates, getDistance } from "./middleware/coordinatesHelper.js";
import { apiRequest } from "./middleware/request.js";
import useEmpresas from './backoffice/Empresa/useEmpresas.js';

const ECOPONTO_GROUP_TOLERANCE_METERS = 5;
const DEPOSITO_ROUTE_OPTIONS = [
  { value: "superficie", label: "Superficial" },
  { value: "subterraneo", label: "Subterrâneo" },
];

const ecopontoIcon = L.divIcon({
  className: "ecoponto-map-marker",
  html: renderToStaticMarkup(<Recycle size={22} strokeWidth={2.4} />),
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20],
  tooltipAnchor: [0, 22],
});

const ecopontoSubterraneoIcon = L.divIcon({
  className: "ecoponto-map-marker ecoponto-subterraneo-map-marker",
  html: renderToStaticMarkup(<Database size={21} strokeWidth={2.4} />),
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20],
  tooltipAnchor: [0, 22],
});

const empresaIcon = L.divIcon({
  className: "empresa-map-marker",
  html: renderToStaticMarkup(<Building2 size={21} strokeWidth={2.4} />),
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20],
});

function getPointCoordinates(ponto) {
  const lat = Number(ponto.latitude ?? ponto.coords?.[0]);
  const lng = Number(ponto.longitude ?? ponto.coords?.[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

function getPercentagem(ponto) {
  const percentagem = Number(Number(ponto.percentagem).toFixed(1));
  return Number.isFinite(percentagem) ? percentagem : 0;
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesDepositoType(ponto, selectedType) {
  return normalizeText(ponto.tipoDeposito) === selectedType;
}

function getEcopontoIcon(ponto) {
  return matchesDepositoType(ponto, "subterraneo")
    ? ecopontoSubterraneoIcon
    : ecopontoIcon;
}

function groupNearbyEcopontos(pontos, tolerance = ECOPONTO_GROUP_TOLERANCE_METERS) {
  const groups = [];

  pontos.forEach((ponto) => {
    const coords = getPointCoordinates(ponto);
    if (!coords) return;

    const existingGroup = groups.find((group) =>
      group.ecopontos.some((existing) => getDistance(coords, existing.coords) <= tolerance)
    );

    const groupedPoint = { ...ponto, coords };

    if (existingGroup) {
      existingGroup.ecopontos.push(groupedPoint);
      return;
    }

    groups.push({
      id: `ecoponto-group-${groups.length}`,
      ecopontos: [groupedPoint],
    });
  });

  return groups.map((group) => {
    const representative = group.ecopontos.reduce((fullest, current) =>
      getPercentagem(current) > getPercentagem(fullest) ? current : fullest
    );

    return {
      ...group,
      representative,
      percentagem: getPercentagem(representative),
      latitude: representative.coords.lat,
      longitude: representative.coords.lng,
    };
  });
}

export default function Mapa() {
  const [pontos, setPontos] = useState([]);
  const [selectedDepositoType, setSelectedDepositoType] = useState("superficie");
  const ecopontoGroups = useMemo(() => groupNearbyEcopontos(pontos), [pontos]);
  const pontosCheios = useMemo(() =>
    ecopontoGroups
      .map((group) => {
        const matchingEcopontos = group.ecopontos.filter((ponto) =>
          matchesDepositoType(ponto, selectedDepositoType)
        );

        if (matchingEcopontos.length === 0) {
          return null;
        }

        return matchingEcopontos.reduce((fullest, current) =>
          getPercentagem(current) > getPercentagem(fullest) ? current : fullest
        );
      })
      .filter((ponto) => ponto && getPercentagem(ponto) > 70),
    [ecopontoGroups, selectedDepositoType]
  );
  const { items: empresas = [] } = useEmpresas();
  const empresasComCoordenadas = empresas.filter(e => e.latitude && e.longitude);
  const sede = formatCoordinates(empresasComCoordenadas);
    useEffect(() => {
      apiRequest("/rotas/coordenadas") 
        .then((data) => {
          setPontos(data);
        });
    }, []);
    const ecopontos = formatCoordinates(pontosCheios);


    const handleGoogleMapsRedirect = () => {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${sede}&waypoints=${ecopontos}`, "_blank");
    };
  return (
    <>
      <div className="map-route-type-toggle" aria-label="Tipo de depósito para rota">
        {DEPOSITO_ROUTE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={selectedDepositoType === option.value ? "is-active" : ""}
            onClick={() => setSelectedDepositoType(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
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
        Abrir Google Maps
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

      {ecopontoGroups.map((group) => (
        <Marker
          key={group.id}
          position={[
            group.latitude,
            group.longitude,
          ]}
          
          icon={getEcopontoIcon(group.representative)}
        >
          <Popup>
            <div className="ecoponto-group-popup">
              <div className="ecoponto-group-items">
                {group.ecopontos.map((ponto, index) => (
                  <div className="ecoponto-group-item" key={`popup-${ponto.codigo}`}>
                    <span className="ecoponto-group-code">Ecoponto {ponto.codigo}</span>
                    <span className="ecoponto-group-value">{getPercentagem(ponto)}%</span>
                    {index < group.ecopontos.length - 1 && <strong>//</strong>}
                  </div>
                ))}
              </div>
            </div>
          </Popup>
          <Tooltip permanent direction="bottom" offset={[0, 10]}>
            {group.percentagem}%
          </Tooltip>
        </Marker>
      ))}
      {empresasComCoordenadas.map((empresa) => (
        <Marker
          key={`empresa-${empresa.id}`}
          position={[
            Number(empresa.latitude),
            Number(empresa.longitude),
          ]}
          icon={empresaIcon}
        >
          <Popup>
            <div>{empresa.nome}</div>
          </Popup>
        </Marker>
      ))}
      <Routing pontos={pontosCheios} />
    </MapContainer>
    </>
  );
}
