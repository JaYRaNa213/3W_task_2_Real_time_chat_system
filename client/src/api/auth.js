import http from './http';

export const loginUser = async (data) => {
  const response = await http.post('/api/auth/login', data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await http.post('/api/auth/register', data);
  return response.data;
};
