import React, { useState } from "react";

export default function RegistroProfesor({ setMode, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    mail: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registro Profesor:", formData);
    onAuthSuccess();
  };

  return (
    <div className="bg-[#12122B] p-8 rounded-lg shadow-lg w-[400px] text-center fade-in">
      <h2 className="text-white text-2xl font-bold">Registrarse</h2>
      <p className="text-gray-400">Profesor</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#2A2A45] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
        />
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#2A2A45] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] btn-animate"
        >
          CONFIRMAR
        </button>
      </form>

      <div className="mt-6 flex justify-between text-white text-sm font-medium">
        <span
          className="cursor-pointer hover:text-gray-300 transition-all duration-200 btn-animate transform hover:scale-105"
          onClick={() => setMode("alumno")}
        >
          ¿Eres un alumno?
        </span>
        <span
          className="cursor-pointer hover:text-gray-300 transition-all duration-200 btn-animate transform hover:scale-105"
          onClick={() => setMode("login")}
        >
          ¿Ya cuentas con cuenta?
        </span>
      </div>
    </div>
  );
}