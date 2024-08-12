import { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';

const DynamicMap = ({ routeCoordinates = [] }) => {
  const [leaflet, setLeaflet] = useState(null);
  const [mapComponents, setMapComponents] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [fencePolygon, setFencePolygon] = useState(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        try {
          const [L, reactLeaflet] = await Promise.all([
            import('leaflet'),
            import('react-leaflet')
          ]);

          const markerIconPng = await import('leaflet/dist/images/marker-icon.png');
          const markerShadowPng = await import('leaflet/dist/images/marker-shadow.png');

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
        } catch (error) {
          console.error('Error loading Leaflet components:', error);
        }
      }
    };

    loadLeaflet();
  }, []);

  const createFencePolygon = (coords, bufferDistance) => {
    if (coords.length < 2) {
      return null; // Retorna null se não houver pontos suficientes para criar uma linha
    }
    // Converte as coordenadas para o formato [longitude, latitude]
    const lineCoords = coords.map(coord => [coord[1], coord[0]]);
    const line = turf.lineString(lineCoords);
    const buffered = turf.buffer(line, bufferDistance, { units: 'kilometers' });
    return buffered.geometry.coordinates[0];
  };

  useEffect(() => {
    const newFencePolygon = createFencePolygon(routeCoordinates, 3);
    setFencePolygon(newFencePolygon);

    if (newFencePolygon && userLocation) {
      const isInsideFence = turf.booleanPointInPolygon(turf.point(userLocation), turf.polygon([newFencePolygon]));

      // if (!isInsideFence) {
      //   console.log('Você saiu da cerca de 3 km após definir a rota!');
      // } else {
      //   console.log('Você está dentro da cerca de 3 km após definir a rota.');
      // }
    }
  }, [routeCoordinates, userLocation]);

  if (!leaflet || !mapComponents) {
    return <div>Loading map...</div>;
  }

  const { MapContainer, TileLayer, Polygon, Polyline, Marker, Tooltip, useMapEvents } = mapComponents;

  const LocationMarker = ({ fencePolygon }) => {
    const map = useMapEvents({
      locationfound(e) {
        const userLocation = [e.latlng.lng, e.latlng.lat];
        setUserLocation([e.latlng.lat, e.latlng.lng]); // Atualiza a localização do usuário

        if (fencePolygon && fencePolygon.length >= 4) {
          const isInsideFence = turf.booleanPointInPolygon(turf.point(userLocation), turf.polygon([fencePolygon]));

          if (!isInsideFence) {
            console.log('Você saiu da cerca de 3 km!');
          } else {
            console.log('Você está dentro da cerca de 3 km.');
          }
        }
      }
    });

    useEffect(() => {
      map.locate({ watch: true });
    }, [map]);

    return null;
  };

  // Removendo o useEffect para invalidateSize pois não é necessário
  // e pode causar erros na renderização de hooks

  return (
    <MapContainer id="map" center={userLocation || routeCoordinates[0] || [-30.0346, -51.2177]} zoom={6} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {routeCoordinates.length > 0 && (
        <>
          <Polyline positions={routeCoordinates} color="black" />
          {fencePolygon && fencePolygon.length >= 4 && (
            <Polygon
              positions={fencePolygon.map(coord => [coord[1], coord[0]])}
              pathOptions={{
                color: 'red',
                fillColor: 'none',
                fillOpacity: 0,
              }}
            />
          )}
        </>
      )}
      <LocationMarker fencePolygon={fencePolygon} />
      {userLocation && (
        <Marker 
          position={userLocation} 
          icon={leaflet.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })}
        >
          <Tooltip>
            <span>Você está aqui</span>
          </Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
};

export default DynamicMap;
