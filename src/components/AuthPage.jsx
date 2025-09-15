import React, { useState } from "react";
import Login from "./IniciarSesion";
import RegistroAlumno from "./RegistroAlumno";
import RegistroProfesor from "./RegistroProfesor";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  const handleAuthSuccess = () => {
    console.log("Usuario autenticado");
    // Aquí podés redirigir a Home con useNavigate si querés
  };

  // Validar el mode
  const renderForm = () => {
    switch (mode) {
      case "login":
        return <Login setMode={setMode} onAuthSuccess={handleAuthSuccess} />;
      case "registroAlumno":
        return <RegistroAlumno setMode={setMode} onAuthSuccess={handleAuthSuccess} />;
      case "registroProfesor":
        return <RegistroProfesor setMode={setMode} onAuthSuccess={handleAuthSuccess} />;
      default:
        setMode("login"); // fallback seguro
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A]">
      {renderForm()}
    </div>
  );
}
