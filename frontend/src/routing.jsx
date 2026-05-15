import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

export default function Routing() {
  const map = useMap();

  useEffect(() => {
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(38.7223, -9.1393), // Lisboa
        L.latLng(41.1579, -8.6291), // Porto
      ],

      routeWhileDragging: true,

      lineOptions: {
        styles: [{ color: "blue", weight: 5 }],
      },

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
  }, [map]);

  return null;
}