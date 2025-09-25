import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const usuarioId = payload?.usuario_id;
      const rol = payload?.rol;

      if (usuarioId) {
        setUsuario({ id: usuarioId, rol });
      }
    } catch (err) {
      console.error("Token inválido:", err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario }}>
      {children}
    </AuthContext.Provider>
  );
};
