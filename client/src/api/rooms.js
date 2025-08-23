import http from './http';

export const fetchRooms = async () => {
  const { data } = await http.get('/api/rooms');
  return data;
};

// Optional helper to get messages via REST (no auth): /api/rooms/:room/messages
export const fetchRoomMessages = async (roomName) => {
  const { data } = await http.get(`/api/rooms/${encodeURIComponent(roomName)}/messages`);
  return data;
};
