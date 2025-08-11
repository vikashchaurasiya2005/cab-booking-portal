import { createContext, useContext, useState } from 'react';
import { api, setAuthToken, connectSocket } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [socket, setSocket] = useState(null);

  // On login, set token, user, and connect socket
  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    setAuthToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    const sock = connectSocket(res.data.token);
    setSocket(sock);
    return res.data.user;
  }

  function logout() {
    setUser(null);
    setToken('');
    setAuthToken('');
    localStorage.removeItem('token');
    if (socket) socket.disconnect();
    setSocket(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
