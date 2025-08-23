import http from './http';

// This one matches your /api/messages/:room route, but note your server
// currently protects /api/messages/* with auth. Prefer socket or rooms route.
export const fetchMessagesByRoom = async (roomName) => {
  const { data } = await http.get(`/api/messages/${encodeURIComponent(roomName)}`);
  return data;
};
