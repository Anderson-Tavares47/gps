import { useState } from 'react';
import { getCoordinates } from '@/utils/geocode';
import { getRoutes } from '@/utils/getRoute';

const AddressForm = ({ onRoutesSubmit, onRouteSubmit }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [routes, setRoutes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startCoordinates = await getCoordinates(start);
      const endCoordinates = await getCoordinates(end);

      console.log('Start Coordinates:', startCoordinates);
      console.log('End Coordinates:', endCoordinates);

      const routes = await getRoutes(startCoordinates, endCoordinates);
      setRoutes(routes);
      onRoutesSubmit(routes);
    } catch (error) {
      alert('Não foi possível obter as coordenadas para os endereços fornecidos.');
    }
  };

  const handleRouteSelection = (route) => {
    onRouteSubmit(route);
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Início:
            <input
              type="text"
              placeholder="Endereço de início"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Destino:
            <input
              type="text"
              placeholder="Endereço de destino"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Obter Rotas</button>
      </form>
      {routes.length > 0 && (
        <div>
          <h3>Selecione a Rota</h3>
          {routes.map((route, index) => (
            <button key={index} onClick={() => handleRouteSelection(route)}>
              Rota {index + 1} - Tempo estimado: {formatDuration(route.duration)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressForm;