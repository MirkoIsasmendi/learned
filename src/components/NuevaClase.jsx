import React, { useState, useContext } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { AuthContext } from "../context/authcontext";

export default function NuevaClase() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [colorSeleccionado, setColorSeleccionado] = useState("");
  const { usuario } = useContext(AuthContext);

  const colores = [
    "bg-yellow-500", "bg-red-500", "bg-blue-500", "bg-pink-500", "bg-black",
    "bg-orange-500", "bg-white", "bg-purple-500", "bg-gray-500", "bg-green-500"
  ];
const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token || !usuario?.id) {
      alert("No estás autenticado correctamente");
      return;
    }

    const body = {
      nombre,
      descripcion,
      profesor_id: usuario.id
    };

    try {
      const res = await fetch(`${API_URL}/api/clases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.status === "ok") {
        alert("Clase creada con éxito");
        setNombre("");
        setDescripcion("");
        setColorSeleccionado("");
      } else {
        alert("Error al crear la clase");
      }
    } catch (err) {
      console.error("Error al conectar con el backend:", err);
      alert("Hubo un problema al crear la clase");
    }
  };

  return (
    <div className="min-h-screen panel flex">
      <div className="flex-1 p-8 relative surface">
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
          className="w-full p-2 rounded surface border mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
        />

        <textarea
          placeholder="Agregar descripción (mín. 5 palabras)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full p-2 h-28 rounded surface border mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
        />

        <div className="w-auto h-auto p-2 rounded-2xl surface border mb-6 grid grid-cols-5 auto-rows-[150px] justify-items-center focus:outline-none fade-in">
          {colores.map((color, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded-xl mt-2 w-34 h-34 ${color} ${colorSeleccionado === color ? 'ring-4 ring-green-500 scale-110' : ''} transition-all duration-200 transform hover:scale-110`}
              onClick={() => setColorSeleccionado(color)}
            ></div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button className="btn btn-secondary">
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Guardar y subir
          </button>
        </div>
      </div>

      <div className="w-1/3 panel p-6">
        <h2 className="text-sm muted mb-4 fade-in">Vista previa</h2>
        <div className="w-[240px] h-[200px] rounded-lg overflow-hidden shadow-md flex flex-col card cursor-pointer tarea-card">
          <div className="flex-1 flex flex-col justify-end card surface-2">
            <div className="p-3">
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                {nombre || "Nombre de la clase"}
              </p>
              <p className="text-xs muted">
                {descripcion || "Descripción de la clase"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
