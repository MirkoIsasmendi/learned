import React, { createContext, useEffect, useState, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const refreshFromToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUsuario(null);
      return;
    }

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
        setUsuario({ id: usuarioId, rol: rol, nombre: nombre }); // Ajusta según los campos reales del token
      }
    } catch (err) {
      console.error("Token inválido:", err);
      setUsuario(null);
    }
  }, []);

  // Inicializar desde token en el primer render
  useEffect(() => {
    refreshFromToken();
  }, [refreshFromToken]);

  // Escuchar cambios en localStorage para sincronizar entre pestañas o cuando
  // otras partes de la app actualicen el token.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") {
        refreshFromToken();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshFromToken]);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, refreshFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};
