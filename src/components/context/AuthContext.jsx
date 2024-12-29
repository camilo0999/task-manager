import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea el contexto de autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado inicial, cargando datos de localStorage si existen
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Función para iniciar sesión
  const login = (userData) => {
    // Guardar datos en el estado y en localStorage
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpiar el estado y localStorage
    setUser(null);
    localStorage.removeItem('user');
  };

  // Sincronizar el estado del usuario con los datos en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto
export const useAuth = () => useContext(AuthContext);

