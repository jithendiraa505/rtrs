import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ 
          id: payload.sub, 
          role: payload.role,
          username: payload.username || payload.sub 
        });
      } catch (error) {
        logout();
      }
    }
  }, [token]);

  const login = (tokenData) => {
    const cleanToken = tokenData.replace('Bearer ', '');
    localStorage.setItem('token', `Bearer ${cleanToken}`);
    setToken(`Bearer ${cleanToken}`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};