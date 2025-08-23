// messages.js
import http from './http';
export const fetchMessages = async (roomId) => {
  const response = await http.get(`/api/messages?roomId=${roomId}`);
  return response.data;
};
