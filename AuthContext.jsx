
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('cms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // In a real app, this would involve an API call
    const mockUser = { id: '1', email: userData.email, name: 'Demo User', role: 'Admin' }; // Mock role
    localStorage.setItem('cms_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signup = (userData) => {
    // In a real app, this would involve an API call
    const mockUser = { id: '2', email: userData.email, name: userData.name || 'New User', role: 'Contributor' }; // Mock role
    localStorage.setItem('cms_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('cms_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
