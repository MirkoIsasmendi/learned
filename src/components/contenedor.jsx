import React, { useRef, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import DetalleTarea from "./DetalleTarjeta";

const Tarjeta = ({ titulo, descripcion, onClick }) => (
  <div
    className="w-[240px] h-[200px] flex-none rounded-lg overflow-hidden shadow-md flex flex-col border border-gray-700 cursor-pointer tarea-card transition-all duration-300 hover:scale-105"
    onClick={onClick}
  >
    <div className="flex-1 bg-[#1B1B2F]"></div>
    <div className="bg-[#BFBFC4] p-3">
      <h3 className="text-sm font-bold text-black">{titulo}</h3>
      <p className="text-xs text-gray-800">{descripcion}</p>
    </div>
  </div>
);

const SeccionCarrusel = ({ titulo, tarjetas, onTarjetaClick }) => {
  const referenciaScroll = useRef(null);

  const desplazarIzquierda = () => {
    referenciaScroll.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const desplazarDerecha = () => {
    referenciaScroll.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  return (
    <div className="bg-[#1E1E2E] p-6 h-[300px] rounded-lg shadow-md relative fade-in">
      <h2 className="text-lg text-white font-semibold mb-4">{titulo}</h2>

      <button
        onClick={desplazarIzquierda}
        className="absolute left-[-10px] top-[50%] transform -translate-y-1/2 bg-transparent p-2 rounded-full z-10 text-white cursor-pointer hover:text-gray-400 btn-animate transform hover:scale-110 transition-all duration-200"
        type="button"
      >
        <GrFormPrevious size={24} />
      </button>

      <div className="overflow-hidden w-full">
        <div
          ref={referenciaScroll}
          className="flex space-x-4 min-w-[70vw] max-w-[70vw] overflow-x-auto scrollbar-hide"
        >
          {tarjetas.map((t, i) => (
            <Tarjeta
              key={i}
              titulo={t.titulo}
              descripcion={t.descripcion}
              onClick={() => onTarjetaClick(t)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={desplazarDerecha}
        className="absolute right-[-10px] top-[50%] transform -translate-y-1/2 bg-transparent p-2 rounded-full z-10 text-white cursor-pointer hover:text-gray-400 btn-animate transform hover:scale-110 transition-all duration-200"
        type="button"
      >
        <GrFormNext size={24} />
      </button>
    </div>
  );
};

const Contenedor = () => {
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  if (tareaSeleccionada) {
    return (
      <DetalleTarea
        tarea={tareaSeleccionada}
        onClose={() => setTareaSeleccionada(null)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 flex flex-col items-center">
      <SeccionCarrusel
        titulo="Tareas Pendientes"
        tarjetas={[
          { titulo: "Tarea 1", descripcion: "aaaaaaaaaaaaaaa" },
          { titulo: "Tarea 2", descripcion: "bbbbbbbbbbbbbbbbb" },
          { titulo: "Tarea 3", descripcion: "ccccccccccccccccc" },
        ]}
        onTarjetaClick={(t) => setTareaSeleccionada(t)}
      />

      <SeccionCarrusel
        titulo="Tareas en Proceso"
        tarjetas={[
          { titulo: "Tarea 1", descripcion: "aaaaaaaaaa" },
          { titulo: "Tarea 2", descripcion: "aaaaaaaaaaaasadsasdas" },
        ]}
        onTarjetaClick={(t) => setTareaSeleccionada(t)}
      />

      <SeccionCarrusel
        titulo="Tareas Hechas"
        tarjetas={[
          { titulo: "Tarea 1", descripcion: "aaaaaaaaaaaaaaaadsad" },
          { titulo: "Tarea 2", descripcion: "aaaaaaaaaaa" },
        ]}
        onTarjetaClick={(t) => setTareaSeleccionada(t)}
      />
    </div>
  );
};

export default Contenedor;