import { useState } from 'react';
import dynamic from 'next/dynamic';
import AddressForm from '@/pages/components/AddressForm';
import NavigationMenu from '@/pages/components/NavigationMenu';

const Map = dynamic(() => import('@/pages/components/Map'), { ssr: false });

const AddressPage = () => {
  const [allRoutes, setAllRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [radius, setRadius] = useState(3); // Raio padrão de 3 km

  const handleRoutesSubmit = (routes, receivedRadius) => {
    setAllRoutes(routes);
    setRadius(receivedRadius); // Atualiza o estado do raio
    if (routes.length > 0) {
      setSelectedRoute(routes[0]);
    }
    console.log("Routes received:", routes);
    console.log("Radius received with routes:", receivedRadius);
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    console.log("Selected route:", route);
  };

  const handleRadiusChange = (e) => {
    const newRadius = Number(e.target.value);
    if (!isNaN(newRadius)) {
      setRadius(newRadius);
      console.log("Radius updated to:", newRadius);
    } else {
      console.log("Invalid radius input:", e.target.value);
    }
  };

  const handleRouteConfirm = () => {
    if (selectedRoute) {
      const savedRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
      const routeWithRadius = { ...selectedRoute, radius }; // Inclui o raio na rota
      savedRoutes.push(routeWithRadius);
      localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
      alert("Rota confirmada e salva com sucesso!");
    } else {
      alert("Nenhuma rota selecionada para confirmar!");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <NavigationMenu />
      <div style={{ flex: 1, padding: '10px' }}>
        <AddressForm 
          onRoutesSubmit={handleRoutesSubmit} 
          onRouteSubmit={handleRouteSelect}
        />
        {allRoutes.length > 0 && (
          <div>
            <h3>Confirme a Rota Escolhida</h3>
            {allRoutes.map((route, index) => (
              <button key={index} onClick={() => handleRouteSelect(route)}>
                Rota {index + 1} - Tempo estimado: {formatDuration(route.duration)}
              </button>
            ))}
            {selectedRoute && (
              <div style={{ marginTop: '20px' }}>
                <label>
                  Tamanho do Raio (km):
                  <input
                    type="number"
                    value={radius}
                    onChange={handleRadiusChange} // Atualiza o raio com o valor inserido pelo usuário
                    style={{ marginLeft: '10px' }}
                  />
                </label>
                <button onClick={handleRouteConfirm} style={{ marginLeft: '20px' }}>
                  Confirmar e Salvar Rota
                </button>
              </div>
            )}
          </div>
        )}
        <Map allRoutes={selectedRoute ? [{ coordinates: selectedRoute.coordinates, radius }] : []} radius={radius} /> {/* Passa a rota como um objeto */}
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

export default AddressPage;
