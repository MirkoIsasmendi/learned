import { nav } from "framer-motion/client";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Login({ setMode, onAuthSuccess }) {
  const navigate = useNavigate();
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
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.mail,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login exitoso:", data);
        onAuthSuccess(data.usuario); // o lo que necesites hacer con el usuario
      } else {
        console.error("Error de login:", data.error);
        alert(data.error); // podés mostrarlo en pantalla en vez de alert
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor");
    }
  };


  return (
    <div className="bg-[#12122B] p-8 rounded-lg shadow-lg w-[400px] text-center fade-in">
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

      <div className="mt-6 flex justify-between text-white text-sm font-medium">
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
  );
}
