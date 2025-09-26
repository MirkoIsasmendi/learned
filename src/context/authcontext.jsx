import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Decodificar base64url correctamente
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      const usuarioId = payload?.usuario_id;
      const rol = payload?.rol;
      const nombre = payload?.nombre;

      if (usuarioId) {
        setUsuario({ id: usuarioId, rol: rol, nombre: nombre });// Ajusta según los campos reales del token
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
