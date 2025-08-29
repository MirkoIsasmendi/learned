import { useState } from "react";
import { RxFile } from "react-icons/rx";
import { HiChevronLeft } from "react-icons/hi";

const DetalleTarea = ({ tarea, onClose }) => {
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState([]);

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

  return (
    <div className="p-6 bg-[#1B1B2F] text-white min-h-screen fade-in">
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
            className="flex-1 bg-[#1B1B2F] border border-gray-700 text-white p-4 rounded-lg resize-none outline-none fade-in"
            value={tarea.descripcion || ""}
            placeholder="Descripcion..."
            readOnly
          />

          {/* Caja archivo (solo muestra archivo de ejemplo arriba) */}
          <div className="w-[250px] bg-[#1B1B2F] border border-gray-700 rounded-lg p-4 flex flex-col justify-center max-h-64 overflow-y-auto fade-in">
            <div className="w-full bg-[#2A2A40] rounded-lg px-4 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <RxFile className="text-gray-300 text-xl" />
                <strong className="text-gray-300 text-sm truncate">Nombre de archivo</strong>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
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
            className="flex-1 bg-[#2A2A40] text-white p-3 rounded-lg resize-none outline-none fade-in"
            placeholder="Agregar descripción..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          {/* Caja archivos editable */}
          <div
            onPaste={handlePaste}
            className="w-[250px] bg-[#1B1B2F] border border-gray-700 rounded-lg p-4 flex flex-col justify-start max-h-full overflow-y-auto fade-in"
            tabIndex={0}
          >
            {archivos.length === 0 ? (
              <div className="w-full bg-[#2A2A40] rounded-lg px-4 py-3 flex flex-col gap-1 h-full">
                <div className="flex items-center gap-2">
                  <RxFile className="text-gray-300 text-xl" />
                  <span className="text-gray-300 text-sm">Pega aquí archivos (Ctrl+V)</span>
                </div>
              </div>
            ) : (
              archivos.map((file, index) => (
                <div
                  key={index}
                  className="w-full bg-[#2A2A40] rounded-lg px-4 py-3 flex flex-col gap-1 mb-2 fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-2">
                    <RxFile className="text-gray-300 text-xl" />
                    <strong className="text-gray-300 text-sm truncate">{file.name}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
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
          </div>
        </div>

        {/* Botones alineados abajo a la derecha */}
        <div className="flex justify-end gap-4 mt-4">
          <button className="px-4 py-2 bg-gray-700 rounded-lg btn-animate transform hover:scale-105 transition-all duration-200">
            Guardar Borrador
          </button>
          <button className="px-4 py-2 bg-green-500 rounded-lg btn-animate transform hover:scale-105 transition-all duration-200">
            Guardar y subir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleTarea;