// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';

// Crear el contexto
export const AuthContext = createContext();

// Crear el proveedor (Provider) del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para el usuario (null si no está logueado)

  const login = (userData) => {
    setUser(userData); // Llamado cuando el usuario inicia sesión
  };

  const logout = () => {
    setUser(null); // Llamado cuando el usuario cierra sesión
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

