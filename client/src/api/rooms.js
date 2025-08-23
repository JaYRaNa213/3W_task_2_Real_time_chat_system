// rooms.js
import http from './http';
export const fetchRooms = async () => {
  const response = await http.get('/api/rooms');
  return response.data;
};
