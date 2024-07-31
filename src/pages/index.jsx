import { useState } from 'react';
import dynamic from 'next/dynamic';
import AddressForm from '@/pages/components/AddressForm';

const Map = dynamic(() => import('@/pages/components/Map'), { ssr: false });

const Home = () => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleRoutesSubmit = (routes) => {
    setAllRoutes(routes);
    setRouteCoordinates([]); // Reset any previously selected route
  };

  const handleRouteSubmit = (route) => {
    setSelectedRoute(route);
    setRouteCoordinates(route.coordinates);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '25%', padding: '10px', boxSizing: 'border-box' }}>
        <AddressForm onRoutesSubmit={handleRoutesSubmit} onRouteSubmit={handleRouteSubmit} />
        {allRoutes.length > 0 && (
          <div>
            <h3>Confirme a Rota Escolhida</h3>
            {allRoutes.map((route, index) => (
              <button key={index} onClick={() => handleRouteSubmit(route)}>
                Rota {index + 1} - Tempo estimado: {formatDuration(route.duration)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ width: '75%' }}>
        <Map routeCoordinates={routeCoordinates} />
      </div>
    </div>
  );
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m`;
  }
};

export default Home;
