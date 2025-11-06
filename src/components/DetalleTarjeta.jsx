import { useState, useEffect } from "react";
import { RxFile } from "react-icons/rx";
import { HiChevronLeft } from "react-icons/hi";

const DetalleTarea = ({ tarea, onClose }) => {
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [archivosRemotos, setArchivosRemotos] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Maneja pegar archivos en la caja de abajo
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    const nuevosArchivos = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file") {
        const file = item.getAsFile();
        nuevosArchivos.push(file);
      }
    }
    if (nuevosArchivos.length) {
      setArchivos((prev) => [...prev, ...nuevosArchivos]);
    }
  };

  const fetchArchivosRemotos = async () => {
    if (!tarea || !tarea.id) return;
    try {
      const res = await fetch(`${API_URL}/api/trabajos/${tarea.id}/archivos`);
      if (res.ok) {
        const data = await res.json();
        setArchivosRemotos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error listando archivos remotos', err);
    }
  };

  // Subir archivos seleccionados en `archivos`
  const uploadFiles = async () => {
    if (!tarea || !tarea.id) return alert('Tarea inválida');
    if (archivos.length === 0) return alert('No hay archivos para subir');

    const form = new FormData();
    archivos.forEach((f) => form.append('files', f));

    try {
      const res = await fetch(`${API_URL}/api/trabajos/${tarea.id}/archivos`, {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (res.ok) {
        alert('Archivos subidos correctamente');
        setArchivos([]);
        await fetchArchivosRemotos();
      } else {
        console.error('Error subiendo archivos', data);
        alert(data.error || 'Error al subir archivos');
      }
    } catch (err) {
      console.error('Error de red al subir archivos', err);
      alert('Error de red al subir archivos');
    }
  };

  // Ejecutar listado al montar
  useEffect(() => {
    fetchArchivosRemotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tarea && tarea.id]);

  return (
    <div className="p-6 panel min-h-screen fade-in">
      {/* Parte superior */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold fade-in">{tarea.titulo}</h1>
        <p className="fade-in">{tarea.descripcion}</p>

        <button
          onClick={onClose}
          className="absolute top-[15vh] right-[7vw] p-2 text-gray-400 hover:text-white btn-animate transform hover:scale-110 transition-all duration-200"
          title="Volver"
        >
          <HiChevronLeft className="text-2xl" />
        </button>


        <div className="flex gap-6 mt-6">
          {/* Caja descripción */}
          <textarea
            className="flex-1 surface border border-gray-700 p-4 rounded-lg resize-none outline-none fade-in"
            value={tarea.descripcion || ""}
            placeholder="Descripcion..."
            readOnly
          />

          {/* Caja archivo (solo muestra archivo de ejemplo arriba) */}
          <div className="w-[250px] surface border border-gray-700 rounded-lg p-4 flex flex-col justify-center max-h-64 overflow-y-auto fade-in">
            <div className="w-full card rounded-lg px-4 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <RxFile className="text-xl" />
                <strong className="text-sm truncate" style={{ color: 'var(--text)' }}>Nombre de archivo</strong>
              </div>
              <div className="flex items-center gap-2 text-xs muted">
                <button className="hover:underline">Abrir archivo</button>
                <span>•</span>
                <button className="hover:underline">Guardar archivo</button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mt-24" />
      </div>

      {/* Zona inferior */}
      <div className="mt-8 flex flex-col h-[300px]">
        <h2 className="text-xl font-semibold mb-2 fade-in">Enviar</h2>

        {/* Contenedor flex para descripción y archivos lado a lado */}
        <div className="flex gap-6 flex-1">
          {/* Descripción editable */}
          <textarea
            className="flex-1 surface p-3 rounded-lg resize-none outline-none fade-in"
            placeholder="Agregar descripción..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          {/* Caja archivos editable */}
          <div
            onPaste={handlePaste}
            className="w-[250px] surface border border-gray-700 rounded-lg p-4 flex flex-col justify-start max-h-full overflow-y-auto fade-in"
            tabIndex={0}
          >
            {archivos.length === 0 ? (
                <div className="w-full card rounded-lg px-4 py-3 flex flex-col gap-1 h-full">
                <div className="flex items-center gap-2">
                  <RxFile className="text-gray-300 text-xl" />
                  <span className="text-gray-300 text-sm">Pega aquí archivos (Ctrl+V)</span>
                </div>
              </div>
            ) : (
              archivos.map((file, index) => (
                <div
                  key={index}
                  className="w-full card rounded-lg px-4 py-3 flex flex-col gap-1 mb-2 fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                      <div className="flex items-center gap-2">
                        <RxFile className="text-xl" />
                        <strong className="text-sm truncate" style={{ color: 'var(--text)' }}>{file.name}</strong>
                      </div>
                      <div className="flex items-center gap-2 text-xs muted">
                        <button className="hover:underline">Abrir archivo</button>
                        <span>•</span>
                        <button
                          className="hover:underline"
                          onClick={() =>
                            setArchivos((prev) => prev.filter((_, i) => i !== index))
                          }
                        >
                          Eliminar
                        </button>
                      </div>
                </div>
              ))
            )}
              <div className="mt-4">
                <button
                  onClick={uploadFiles}
                  className="w-full btn btn-primary"
                >
                  Subir archivos
                </button>
              </div>
          </div>
        </div>

        {/* Botones alineados abajo a la derecha */}
        <div className="flex justify-end gap-4 mt-4">
          <button className="btn btn-secondary">
            Guardar Borrador
          </button>
          <button className="btn btn-primary">
            Guardar y subir
          </button>
        </div>
      </div>

      {/* Lista de archivos subidos */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Archivos subidos</h3>
        {archivosRemotos.length === 0 ? (
          <p className="muted">No hay archivos subidos</p>
        ) : (
          archivosRemotos.map((f, i) => (
            <div key={i} className="flex items-center justify-between card p-2 rounded mb-2">
              <span className="text-sm truncate" style={{ color: 'var(--text)' }}>{f.filename}</span>
              <a href={f.url} className="text-green-400 hover:underline" target="_blank" rel="noreferrer">Descargar</a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DetalleTarea;