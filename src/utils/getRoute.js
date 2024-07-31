// utils/getRoute.js
import axios from 'axios';

export const getRoutes = async (start, end) => {
  const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&alternatives=true&geometries=geojson`);
  const routes = response.data.routes.map(route => ({
    coordinates: route.geometry.coordinates.map(coord => [coord[1], coord[0]]),
    duration: route.duration // duração em segundos
  }));
  return routes;
};