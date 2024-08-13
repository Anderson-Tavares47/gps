import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Loader from '@/pages/components/Loader';
import NavigationMenu from '@/pages/components/NavigationMenu';

const Map = dynamic(() => import('@/pages/components/Map'), { ssr: false });

const RouteConfig = () => {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Carregar todas as rotas salvas do localStorage quando o componente é montado
  useEffect(() => {
    const loadRoutes = async () => {
      const savedRoutes = localStorage.getItem('savedRoutes');
      if (savedRoutes) {
        const parsedRoutes = JSON.parse(savedRoutes);
        setRoutes(parsedRoutes); // Armazena todas as rotas no estado
        console.log("Loaded routes:", parsedRoutes); // Verificação de dados
      }
      setIsLoading(false); // Desativa o loader após o carregamento
    };

    loadRoutes();
  }, []);

  // Cria um array de objetos com as coordenadas e o raio para cada rota
  const allRoutesWithRadius = routes.map(route => ({
    coordinates: route.coordinates,
    radius: parseFloat(route.radius) || 3
  }));

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <NavigationMenu />
      <div style={{ flex: 1, position: 'relative' }}>
        {isLoading ? (
          <Loader /> // Exibe o componente Loader durante o carregamento
        ) : (
          routes.length > 0 ? (
            <div style={{ height: '100%' }}>
              <Map allRoutes={allRoutesWithRadius} />
            </div>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>Nenhuma rota salva encontrada.</p>
          )
        )}
      </div>
    </div>
  );
};

export default RouteConfig;
