import React, { useState, useContext } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

export default function NuevaTarea() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const { id } = useParams();
  const { usuario } = useContext(AuthContext);

  const handleGuardarTarea = async () => {
    const token = localStorage.getItem("token");

    if (!token || !usuario?.id || usuario.rol !== "profesor") {
      alert("No estás autorizado para crear tareas");
      return;
    }

    if (!nombre || !descripcion || !id) {
      alert("Faltan campos obligatorios");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/trabajos/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: nombre,
          descripcion
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Tarea creada con éxito");
        window.history.back();
      } else {
        alert(data.error || "Error al crear la tarea");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f25] text-white flex">
      <div className="flex-1 p-8 relative bg-[#0f0f25]">
        <button
          className="absolute text-gray-500 top-4 right-4 p-2 cursor-pointer hover:text-white btn-animate transform hover:scale-110 transition-all duration-200"
          onClick={() => window.history.back()}
        >
          <HiChevronLeft className="text-lg" />
        </button>

        <h1 className="text-2xl font-bold mb-6 fade-in">Nueva Tarea</h1>

        <input
          type="text"
          placeholder="Nombre de la tarea"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 rounded bg-[#1a1a35] border border-gray-700 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
        />

        <textarea
          placeholder="Agregar descripción (mín. 5 palabras)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full p-2 h-28 rounded bg-[#1a1a35] border border-gray-700 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
        />

        <textarea
          placeholder="Agregar archivos"
          onChange={(e) => setArchivo(e.target.value)}
          className="w-full p-2 h-28 rounded bg-[#1a1a35] border border-gray-700 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
        />

        <div className="flex space-x-4">
          <button className="px-4 py-2 rounded bg-gray-700 cursor-pointer hover:bg-gray-600 btn-animate transform hover:scale-105 transition-all duration-200">
            Guardar Borrador
          </button>
          <button
            onClick={handleGuardarTarea}
            className="px-4 py-2 rounded bg-green-500 cursor-pointer hover:bg-green-600 btn-animate transform hover:scale-105 transition-all duration-200"
          >
            Guardar y subir
          </button>
        </div>
      </div>

      <div className="w-1/3 bg-black p-6">
        <h2 className="text-sm text-gray-400 mb-4 fade-in">Vista previa</h2>
        <div className="w-[240px] h-[200px] rounded-lg overflow-hidden shadow-md flex flex-col border border-gray-700 cursor-pointer tarea-card">
          <div className="flex-1 flex flex-col justify-end bg-[#1B1B2F]">
            <div className="bg-[#BFBFC4] p-3">
              <p className="text-sm font-bold text-black">
                {nombre || "Nombre de la tarea"}
              </p>
              <p className="text-xs text-gray-800">
                {descripcion || "Descripción de la tarea"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
