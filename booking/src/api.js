// API and Socket.IO helpers for frontend integration
import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api'; // Adjust if backend runs elsewhere

export const api = axios.create({
  baseURL: API_BASE,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export function connectSocket(token) {
  return io('http://localhost:5000', {
    auth: { token },
    transports: ['websocket'],
  });
}
