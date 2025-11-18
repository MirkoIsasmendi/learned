import React, { useState, useContext } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

export default function NuevaTarea() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const { usuario } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setArchivo(file.value)

    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.text();
      setMensaje(data);
    } catch (err) {
      setMensaje("Error al subir archivo");
    }
  };

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
      const response = await fetch(`${API_URL}/api/trabajos/${id}`, {
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
        const tareaId = data.trabajo_id;
        // Upload any pending files and associate them with the task
        if (archivos.length > 0) {
          const formData = new FormData();
          archivos.forEach((f) => formData.append('files', f));
          try {
            await fetch(`${API_URL}/api/trabajos/${tareaId}/archivos`, {
              method: 'POST',
              body: formData
            });
          } catch (err) {
            console.warn('Algunos archivos no se pudieron subir:', err);
          }
        }
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
    <div className="min-h-screen panel flex">
      <div className="flex-1 p-8 relative surface">
        <button
          className="absolute muted top-4 right-4 p-2 cursor-pointer btn-animate transform hover:scale-110 transition-all duration-200"
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
          className="w-full p-2 rounded surface border mb-6 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 fade-in"
        />

        <textarea
          placeholder="Agregar descripción (mín. 5 palabras)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full p-2 h-28 rounded surface border mb-6 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 fade-in"
        />

        <input
          type="file"
          placeholder="Agregar archivos"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setArchivos([...archivos, file]);
              setArchivo(file.name);
            }
          }}
          className="w-full p-2 h-28 rounded surface border mb-6 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 fade-in"
        />

        <div className="flex space-x-4">
          <button className="btn btn-secondary">
            Guardar Borrador
          </button>
          <button
            onClick={handleGuardarTarea}
            className="btn btn-primary"
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
                {nombre || "Nombre de la tarea"}
              </p>
              <p className="text-xs muted">
                {descripcion || "Descripción de la tarea"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
