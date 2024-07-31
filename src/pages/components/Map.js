import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

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

  const { MapContainer, TileLayer, Circle, Polyline, useMapEvents } = mapComponents;

  const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const lat1 = coords1[0];
    const lon1 = coords1[1];
    const lat2 = coords2[0];
    const lon2 = coords2[1];
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getSpacedCircles = (coords, interval) => {
    let distance = 0;
    const circles = [coords[0]];
    for (let i = 1; i < coords.length; i++) {
      distance += haversineDistance(coords[i - 1], coords[i]);
      if (distance >= interval) {
        circles.push(coords[i]);
        distance = 0;
      }
    }
    return circles;
  };

  const LocationMarker = ({ routeCoordinates }) => {
    const [alertShown, setAlertShown] = useState(false);
    const map = useMapEvents({
      locationfound(e) {
        const userLocation = [e.latlng.lat, e.latlng.lng];
        const isInsideAnyCircle = routeCoordinates.some(center => {
          const distance = map.distance(center, userLocation);
          return distance <= 3000;
        });

        if (!isInsideAnyCircle && !alertShown) {
          alert('Você saiu do raio de 3 km!');
          setAlertShown(true);
        } else if (isInsideAnyCircle && alertShown) {
          setAlertShown(false);
        }
      }
    });

    useEffect(() => {
      map.locate({ watch: true });
    }, [map]);

    return null;
  };

  const spacedCircles = getSpacedCircles(routeCoordinates, 5.5);

  return (
    <MapContainer center={routeCoordinates[0] || [-30.0346, -51.2177]} zoom={6} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {routeCoordinates.length > 0 && (
        <>
          <Polyline positions={routeCoordinates} color="black" />
          {spacedCircles.map((coord, index) => (
            <Circle
              key={index}
              center={coord}
              radius={3000}
              pathOptions={{
                color: 'red',
                fillColor: 'none',
                fillOpacity: 0,
              }}
            />
          ))}
          <LocationMarker routeCoordinates={spacedCircles} />
        </>
      )}
    </MapContainer>
  );
};

export default Map;
