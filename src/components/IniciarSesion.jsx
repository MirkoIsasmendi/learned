import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login({ setMode, onAuthSuccess }) {
  const navigate = useNavigate();
  const { setUsuario } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    mail: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
  const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.mail,
          password: formData.password
        })
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Respuesta inválida del servidor:", text);
        alert("Error al interpretar la respuesta del servidor");
        return;
      }

      if (response.ok) {
        console.log("Login exitoso:", data);

        // Guardar token
        localStorage.setItem("token", data.token);

        // Actualizar contexto para que otros componentes lo vean sin recargar
        try {
          if (setUsuario) {
            // use usuario from response if available, else trigger refreshFromToken elsewhere
            if (data.usuario) setUsuario(data.usuario);
          }
        } catch (err) {
          console.warn("No se pudo setUsuario en el contexto:", err);
        }

        // Ejecutar callback si existe
        if (onAuthSuccess) {
          onAuthSuccess(data.usuario);
        }

        // Navegar solo después de actualizar estado/contexto
        navigate("/");
      } else {
        console.error("Error de login:", data.error);
        alert(data.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-[#0D0D1A] px-4">
    <div className="bg-[#12122B] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-center fade-in">
      <h2 className="text-white text-2xl font-bold">Iniciar Sesión</h2>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="mail"
          placeholder="Correo electrónico"
          value={formData.mail}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#2A2A45] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#2A2A45] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] btn-animate"
        >
          INGRESAR
        </button>
      </form>

      <div className="mt-6 flex flex-col sm:flex-row justify-between text-white text-sm font-medium gap-2 sm:gap-0">
        <span
          className="cursor-pointer hover:text-gray-300"
          onClick={() => navigate("/Registro-Alumno")}
        >
          ¿Eres un alumno?
        </span>
        <span
          className="cursor-pointer hover:text-gray-300"
          onClick={() => navigate("/Registro-Profesor")}
        >
          ¿Eres un profesor?
        </span>
      </div>
    </div>
  </div>
);

}
