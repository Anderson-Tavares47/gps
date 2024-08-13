import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./DynamicMap'), { ssr: false });

const MapWrapper = ({ allRoutes = [], radius }) => {
  console.log("MapWrapper - allRoutes:", allRoutes); // Log para verificar as rotas
  console.log("MapWrapper - radius:", radius); // Log para verificar o raio
  return <DynamicMap allRoutes={allRoutes} radius={radius} />;
};

export default MapWrapper;
