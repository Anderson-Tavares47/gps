import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import * as turf from '@turf/turf';

const Map = ({ routeCoordinates }) => {
  const [leaflet, setLeaflet] = useState(null);
  const [mapComponents, setMapComponents] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Promise.all([
        import('leaflet'),
        import('react-leaflet'),
        import('leaflet/dist/leaflet.css'),
        import('leaflet/dist/images/marker-icon.png'),
        import('leaflet/dist/images/marker-shadow.png'),
      ]).then(([L, reactLeaflet, , markerIconPng, markerShadowPng]) => {
        const defaultIcon = L.icon({
          iconUrl: markerIconPng.default,
          shadowUrl: markerShadowPng.default,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        L.Marker.prototype.options.icon = defaultIcon;

        setLeaflet(L);
        setMapComponents(reactLeaflet);
      });
    }
  }, []);

  if (!leaflet || !mapComponents) {
    return <div>Loading map...</div>;
  }

  const { MapContainer, TileLayer, Polygon, Polyline, useMapEvents } = mapComponents;

  const createFencePolygon = (coords, bufferDistance) => {
    if (coords.length < 2) {
      return []; // Retorna um array vazio se não houver pontos suficientes para criar uma linha
    }
    // Converte as coordenadas para o formato [longitude, latitude]
    const lineCoords = coords.map(coord => [coord[1], coord[0]]);
    const line = turf.lineString(lineCoords);
    const buffered = turf.buffer(line, bufferDistance, { units: 'kilometers' });
    return buffered.geometry.coordinates[0];
  };

  const LocationMarker = ({ fencePolygon }) => {
    const [alertShown, setAlertShown] = useState(false);
    const map = useMapEvents({
      locationfound(e) {
        const userLocation = [e.latlng.lng, e.latlng.lat];
        const isInsideFence = turf.booleanPointInPolygon(turf.point(userLocation), turf.polygon([fencePolygon]));

        if (!isInsideFence && !alertShown) {
          alert('Você saiu da cerca de 3 km!');
          setAlertShown(true);
        } else if (isInsideFence && alertShown) {
          setAlertShown(false);
        }
      }
    });

    useEffect(() => {
      map.locate({ watch: true });
    }, [map]);

    return null;
  };

  const fencePolygon = createFencePolygon(routeCoordinates, 3);

  return (
    <MapContainer center={routeCoordinates[0] || [-30.0346, -51.2177]} zoom={6} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {routeCoordinates.length > 0 && (
        <>
          <Polyline positions={routeCoordinates} color="black" />
          {fencePolygon.length > 0 && (
            <Polygon
              positions={fencePolygon.map(coord => [coord[1], coord[0]])}
              pathOptions={{
                color: 'red',
                fillColor: 'none',
                fillOpacity: 0,
              }}
            />
          )}
          <LocationMarker fencePolygon={fencePolygon} />
        </>
      )}
    </MapContainer>
  );
};

export default Map;
