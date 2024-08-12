import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./DynamicMap'), { ssr: false });

const MapWrapper = ({ routeCoordinates = [] }) => {
  return <DynamicMap routeCoordinates={routeCoordinates} />;
};

export default MapWrapper;
