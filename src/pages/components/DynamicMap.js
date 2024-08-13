import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // Use dynamic import from Next.js

const DynamicMap = ({ allRoutes = [], radius }) => {
  const [leaflet, setLeaflet] = useState(null);
  const [mapComponents, setMapComponents] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [fencePolygons, setFencePolygons] = useState([]);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        try {
          const [L, reactLeaflet] = await Promise.all([
            import('leaflet'),
            import('react-leaflet')
          ]);
          const defaultIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

  useEffect(() => {
    if (allRoutes && mapComponents) {
      const processRoutes = (routes) => {
        const routeArray = Array.isArray(routes) ? routes : [routes];
        const polygons = routeArray.map(route => {
          const routeRadius = route.radius ? parseFloat(route.radius) : radius;
          return route.coordinates ? createFencePolygon(route.coordinates, routeRadius) : null;
        });
        setFencePolygons(polygons);
      };

      processRoutes(allRoutes);
    }
  }, [allRoutes, radius, mapComponents]);

  const createFencePolygon = (coords, bufferDistance) => {
    if (!coords || coords.length < 2) return null;
    const lineCoords = coords.map(coord => [coord[1], coord[0]]);
    const line = turf.lineString(lineCoords);
    const buffered = turf.buffer(line, bufferDistance, { units: 'kilometers' });
    return buffered.geometry.coordinates[0];
  };

  if (!leaflet || !mapComponents) {
    return <div>Loading map...</div>;
  }

  const { MapContainer, TileLayer, Polygon, Polyline, Marker, Tooltip, useMapEvents } = mapComponents;

  const LocationMarker = () => {
    const map = useMapEvents({
      locationfound(e) {
        setUserLocation([e.latlng.lat, e.latlng.lng]);
      }
    });

    useEffect(() => {
      map.locate({ watch: true });
    }, [map]);

    return null;
  };

  const defaultCenter = [-30.0346, -51.2177];
  const routeArray = Array.isArray(allRoutes) ? allRoutes : [allRoutes];
  const firstRoute = routeArray[0];
  const mapCenter = userLocation || (firstRoute && firstRoute.coordinates && firstRoute.coordinates.length > 0 ? [firstRoute.coordinates[0][0], firstRoute.coordinates[0][1]] : defaultCenter);

  return (
    <MapContainer center={mapCenter} zoom={6} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {routeArray.map((route, index) => (
        <React.Fragment key={`route-group-${index}`}>
          {route.coordinates && (
            <Polyline positions={route.coordinates.map(coord => [coord[0], coord[1]])} color="black"/>
          )}
          {fencePolygons[index] && (
            <Polygon
              positions={fencePolygons[index].map(coord => [coord[1], coord[0]])}
              pathOptions={{ color: 'red', fillColor: 'none', fillOpacity: 0.5 }}
            />
          )}
        </React.Fragment>
      ))}
      <LocationMarker />
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
          <Tooltip><span>Você está aqui</span></Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
};

export default DynamicMap;
