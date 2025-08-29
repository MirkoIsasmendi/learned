import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  const handleCrearTarea = () => {
    navigate("/clase/crear-Tarea");
  };

  return (
    <nav className="bg-gradient-to-r from-[#0F0F13] to-[#1A1A2E] h-[60px] px-6 flex items-center justify-between border-b border-[#F3F3F3] fade-in">
      <h1 className="text-xl text-white">Nombre de la Clase</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={handleCrearTarea}
          className="px-4 py-1 rounded bg-green-600 cursor-pointer text-white hover:bg-green-700 btn-animate transform hover:scale-102 transition-all duration-200"
        >
          Crear Tarea
        </button>

        <button onClick={handleClose} aria-label="Cerrar y volver al home" className="btn-animate transform hover:scale-110 transition-all duration-200">
          <CgClose className="text-2xl text-white hover:text-gray-400 cursor-pointer" />
        </button>
      </div>
    </nav>
  );
}