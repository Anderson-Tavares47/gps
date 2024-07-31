// utils/geocode.js
import axios from 'axios';

export const getCoordinates = async (address) => {
  const response = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: address,
      format: 'json',
      addressdetails: 1,
      limit: 1,
    },
  });

  if (response.data.length === 0) {
    throw new Error('Address not found');
  }

  const { lat, lon } = response.data[0];
  return [parseFloat(lat), parseFloat(lon)];
};