import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

export default function Routing({ pontos = [] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const waypoints = pontos
      .map((p) => {
        const lat = Number(p.latitude ?? p.coords?.[0]);
        const lng = Number(p.longitude ?? p.coords?.[1]);
        if (Number.isFinite(lat) && Number.isFinite(lng)) return L.latLng(lat, lng);
        return null;
      })
      .filter(Boolean);

    if (waypoints.length < 2) return;

    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: true,
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      createMarker: () => null,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, JSON.stringify(pontos)]);

  return null;
}