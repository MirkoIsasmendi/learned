import React, { useState } from "react";
import { HiChevronLeft } from "react-icons/hi";

export default function NuevaClase() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [colorSeleccionado, setColorSeleccionado] = useState("");
  
  const colores = [
    "bg-yellow-500", "bg-red-500", "bg-blue-500", "bg-pink-500", "bg-black",
    "bg-orange-500", "bg-white", "bg-purple-500", "bg-gray-500", "bg-green-500"
  ];

  return (
    <div className="min-h-screen bg-[#0f0f25] text-white flex">
      
      {/* Contenedor principal */}
      <div className="flex-1 p-8 relative bg-[#0f0f25]">
        
        <button
          className="absolute text-gray-500 top-4 right-4 p-2 cursor-pointer hover:text-white btn-animate transform hover:scale-110 transition-all duration-200"
          onClick={() => window.history.back()}
        >
          <HiChevronLeft className="text-lg" />
        </button>

        <h1 className="text-3xl font-bold mb-6 fade-in">Crear Clase</h1>

        <input
          type="text"
          placeholder="Nombre de la clase"
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

        <div className="w-auto h-auto p-2 rounded-2xl bg-[#1a1a35] border border-gray-700 mb-6 grid grid-cols-5 auto-rows-[150px] justify-items-center focus:outline-none fade-in">
          {colores.map((color, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded-xl mt-2 w-34 h-34 ${color} ${colorSeleccionado === color ? 'ring-4 ring-green-500 scale-110' : ''} transition-all duration-200 transform hover:scale-110`}
              onClick={() => setColorSeleccionado(color)}
            ></div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 btn-animate transform hover:scale-105 transition-all duration-200">
            Cancelar
          </button>
          <button className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 btn-animate transform hover:scale-105 transition-all duration-200">
            Guardar y subir
          </button>
        </div>
      </div>

      {/* Contenedor negro con vista previa */}
      <div className="w-1/3 bg-black p-6">
        <h2 className="text-sm text-gray-400 mb-4 fade-in">Vista previa</h2>
        <div className="w-[240px] h-[200px] rounded-lg overflow-hidden shadow-md flex flex-col border border-gray-700 cursor-pointer tarea-card">
          <div className="flex-1 flex flex-col justify-end bg-[#1B1B2F]">
            <div className="bg-[#BFBFC4] p-3">
              <p className="text-sm font-bold text-black">
                {nombre || "Nombre de la clase"}
              </p>
              <p className="text-xs text-gray-800">
                {descripcion || "Descripción de la clase"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}