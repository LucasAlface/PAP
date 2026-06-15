import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Building2, Database, MapPin, Recycle } from "lucide-react";
import Routing from "./routing.jsx";
import { formatCoordinates, getDistance } from "./middleware/coordinatesHelper.js";
import { apiRequest } from "./middleware/request.js";
import useEmpresas from './backoffice/Empresa/useEmpresas.js';
import { useAuth } from "./context/AuthContext.jsx";

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

const empresaUnselectedIcon = L.divIcon({
  className: "empresa-map-marker empresa-map-marker-unselected",
  html: renderToStaticMarkup(<Building2 size={21} strokeWidth={2.4} />),
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20],
});

const selectedEcopontoIcon = L.divIcon({
  className: "map-selection-marker",
  html: renderToStaticMarkup(<MapPin size={24} strokeWidth={2.6} />),
  iconSize: [40, 40],
  iconAnchor: [20, 36],
  popupAnchor: [0, -34],
});

const selectedEmpresaIcon = L.divIcon({
  className: "map-selection-marker map-selection-marker-empresa",
  html: renderToStaticMarkup(<Building2 size={22} strokeWidth={2.5} />),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -22],
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

function formatMapCoordinate(value) {
  return Number(value).toFixed(7);
}

function getSelectedCoordinates(coordinates) {
  if (!coordinates) return null;

  if (
    coordinates.latitude == null ||
    coordinates.longitude == null ||
    String(coordinates.latitude).trim() === "" ||
    String(coordinates.longitude).trim() === ""
  ) {
    return null;
  }

  const lat = Number(coordinates.latitude);
  const lng = Number(coordinates.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

function MapClickPicker({ enabled, onPick }) {
  useMapEvents({
    click(event) {
      if (!enabled || !onPick) return;

      onPick({
        latitude: formatMapCoordinate(event.latlng.lat),
        longitude: formatMapCoordinate(event.latlng.lng),
      });
    },
  });

  return null;
}

function MapSearchControl() {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const stopMapInteraction = (event) => {
    event.stopPropagation();
  };

  const handleSearch = async (event) => {
    event?.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    setStatus("A procurar...");

    try {
      const params = new URLSearchParams({
        format: "json",
        limit: "1",
        q: trimmedQuery,
      });

      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Não foi possível pesquisar essa localização.");
      }

      const results = await response.json();
      const [result] = results;

      if (!result) {
        setStatus("Sem resultados.");
        return;
      }

      map.setView([Number(result.lat), Number(result.lon)], 16);
      setStatus("");
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.stopPropagation();
    handleSearch(event);
  };

  return (
    <div
      className="map-search-control leaflet-control"
      role="search"
      onClick={stopMapInteraction}
      onDoubleClick={stopMapInteraction}
      onMouseDown={stopMapInteraction}
      onTouchStart={stopMapInteraction}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleSearchKeyDown}
        placeholder="Pesquisar no OpenStreetMap"
        aria-label="Pesquisar localização no OpenStreetMap"
      />
      <button type="button" onClick={handleSearch}>Pesquisar</button>
      {status && <span>{status}</span>}
    </div>
  );
}

function MapSelectedCoordinateFocus({ coordinates, enabled }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled || !coordinates) return;

    map.panTo([coordinates.lat, coordinates.lng]);
  }, [coordinates, enabled, map]);

  return null;
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

export default function Mapa({
  canPickEcopontoCoordinates = false,
  canPickEmpresaCoordinates = false,
  onEcopontoCoordinatesSelected,
  onEmpresaCoordinatesSelected,
  onAddEcopontoAt,
  selectedCoordinates,
  showRouteControls = true,
}) {
  const [pontos, setPontos] = useState([]);
  const [selectedDepositoType, setSelectedDepositoType] = useState("superficie");
  const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);
  const [routeActive, setRouteActive] = useState(false);
  const [routeRefreshKey, setRouteRefreshKey] = useState(0);
  const { authUser } = useAuth();
  const isSuperAdmin = authUser?.cargo === 1;
  const canPickCoordinates = canPickEcopontoCoordinates || canPickEmpresaCoordinates;
  const selectedLatitude = selectedCoordinates?.latitude;
  const selectedLongitude = selectedCoordinates?.longitude;
  const selectedMapCoordinates = useMemo(
    () => getSelectedCoordinates({ latitude: selectedLatitude, longitude: selectedLongitude }),
    [selectedLatitude, selectedLongitude]
  );
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
  const empresasComCoordenadas = useMemo(() =>
    empresas.filter(e => Number.isFinite(Number(e.latitude)) && Number.isFinite(Number(e.longitude))),
    [empresas]
  );
  const selectedEmpresa = useMemo(() => {
    if (empresasComCoordenadas.length === 0) return null;

    return empresasComCoordenadas.find((empresa) => String(empresa.id) === String(selectedEmpresaId)) ||
      empresasComCoordenadas[0];
  }, [empresasComCoordenadas, selectedEmpresaId]);
  const selectedEmpresaIdForRequest = isSuperAdmin ? selectedEmpresaId : null;

  const sede = selectedEmpresa ? formatCoordinates([selectedEmpresa]) : "";
  const ecopontos = formatCoordinates(pontosCheios);
  const pontosRota = useMemo(() =>
    selectedEmpresa
      ? [...pontosCheios, selectedEmpresa]
      : pontosCheios,
    [pontosCheios, selectedEmpresa]
  );

  const fetchPontos = useCallback(() => {
    if (isSuperAdmin && !selectedEmpresaIdForRequest) {
      setPontos([]);
      return Promise.resolve([]);
    }

    const request = isSuperAdmin
      ? apiRequest("/rotas/coordenadas", "POST", { empresaId: selectedEmpresaIdForRequest })
      : apiRequest("/rotas/coordenadas");

    return request.then((data) => {
      setPontos(data);
      return data;
    });
  }, [isSuperAdmin, selectedEmpresaIdForRequest]);

  useEffect(() => {
    fetchPontos();
  }, [fetchPontos]);

  useEffect(() => {
    const handleModelChanged = (event) => {
      if (event.detail?.modelName === "ecoponto") {
        fetchPontos().then(() => {
          if (routeActive) {
            setRouteRefreshKey((currentKey) => currentKey + 1);
          }
        });
      }
    };

    window.addEventListener("model:changed", handleModelChanged);

    return () => {
      window.removeEventListener("model:changed", handleModelChanged);
    };
  }, [fetchPontos, routeActive]);

  useEffect(() => {
    if (empresasComCoordenadas.length === 0) {
      setSelectedEmpresaId(null);
      return;
    }

    setSelectedEmpresaId((currentId) => {
      if (currentId && empresasComCoordenadas.some((empresa) => String(empresa.id) === String(currentId))) {
        return currentId;
      }

      return empresasComCoordenadas[0].id;
    });
  }, [empresasComCoordenadas]);

  const handleGoogleMapsRedirect = () => {
    if (!sede) return;

    window.open(`https://www.google.com/maps/dir/?api=1&destination=${sede}&waypoints=${ecopontos}`, "_blank");
  };

  const handleRouteAction = () => {
    if (routeActive) {
      handleGoogleMapsRedirect();
      return;
    }

    setRouteActive(true);
    setRouteRefreshKey((currentKey) => currentKey + 1);
  };

  return (
    <>
      {showRouteControls && (
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
            type="button"
            onClick={handleRouteAction}
            className="map-route-action"
          >
            {routeActive ? "Abrir Google Maps" : "Calcular rota"}
          </button>
        </>
      )}
      <MapContainer
      center={selectedMapCoordinates ? [selectedMapCoordinates.lat, selectedMapCoordinates.lng] : [40.6, -8.6]}
      zoom={selectedMapCoordinates ? 16 : 7}
      style={{ height: "100%", width: "100%" }}
    >
      <MapSearchControl />
      <MapSelectedCoordinateFocus
        coordinates={selectedMapCoordinates}
        enabled={canPickCoordinates}
      />
      <MapClickPicker
        enabled={canPickCoordinates}
        onPick={canPickEmpresaCoordinates ? onEmpresaCoordinatesSelected : onEcopontoCoordinatesSelected}
      />
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
              {onAddEcopontoAt && (
                <button
                  type="button"
                  className="ecoponto-popup-add"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAddEcopontoAt({
                      latitude: formatMapCoordinate(group.latitude),
                      longitude: formatMapCoordinate(group.longitude),
                    });
                  }}
                >
                  Adicionar ecoponto
                </button>
              )}
              <div className="ecoponto-group-items">
                {group.ecopontos.map((ponto, index) => (
                  <div className="ecoponto-group-item" key={`popup-${ponto.codigo}`}>
                    <span className="ecoponto-group-code">Ecoponto {ponto.codigo}</span>
                    <span className="ecoponto-group-value">{getPercentagem(ponto)}%</span>
                    {index < group.ecopontos.length - 1}
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
          icon={String(selectedEmpresa?.id) === String(empresa.id) ? empresaIcon : empresaUnselectedIcon}
          eventHandlers={{
            click: () => {
              if (isSuperAdmin) {
                setSelectedEmpresaId(empresa.id);
              }
            },
          }}
        >
          <Popup>
            <div>{empresa.nome}</div>
          </Popup>
        </Marker>
      ))}
      {selectedMapCoordinates && (
        <Marker
          key="selected-map-coordinate"
          position={[selectedMapCoordinates.lat, selectedMapCoordinates.lng]}
          icon={canPickEmpresaCoordinates ? selectedEmpresaIcon : selectedEcopontoIcon}
        >
          <Popup>
            <div>Local selecionado</div>
          </Popup>
        </Marker>
      )}
      {showRouteControls && routeActive && (
        <Routing pontos={pontosRota} refreshKey={routeRefreshKey} />
      )}
    </MapContainer>
    </>
  );
}
