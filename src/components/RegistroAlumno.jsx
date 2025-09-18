import React, { useState } from "react";

export default function RegistroAlumno({ setMode, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    mail: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register/alumno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.mail,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registro exitoso:", data);
        onAuthSuccess(data); // o data.usuario_id si querés usar el ID
      } else {
        console.error("Error en el registro:", data.error);
        alert(data.error);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor");
    }
  };


  return (
    <div className="bg-[#12122B] p-8 rounded-lg shadow-lg w-[400px] text-center fade-in">
      <h2 className="text-white text-2xl font-bold">Registrarse</h2>
      <p className="text-gray-400">Alumno</p>

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
          className="cursor-pointer hover:text-gray-300"
          onClick={() => setMode("registroProfesor")}
        >
          ¿Eres un profesor?
        </span>
        <span
          className="cursor-pointer hover:text-gray-300"
          onClick={() => setMode("login")}
        >
          ¿Ya tienes cuenta?
        </span>
      </div>

    </div>
  );
}
