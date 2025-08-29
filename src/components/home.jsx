import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();

  const handleCrearClase = () => {
    navigate("/crear-Clase");
  };
  return (
    <div className="flex h-screen bg-[#0B0B13] text-white font-sans">
      <div className="w-[320px] border-r border-[#1E1E2D] p-4">
        <h2 className="text-white font-semibold text-[15px] mb-4 fade-in">Notifications</h2>

        <div className="bg-[#141426] rounded-lg p-4 mb-4 notification">
          <h3 className="text-[20px] font-bold mb-1">Clase 1</h3>
          <p className="text-[14px] text-gray-300 mb-2">Tarea nueva</p>
          <p className="text-[13px] leading-4">
            Querido alumno el profesor Raul Bonaparte a subido una nueva tarea el día 11/8/2025
          </p>
          <div className="flex justify-end mt-2">
            <button className="bg-[#FF3B6E] hover:bg-[#e2315f] text-white font-bold w-6 h-6 rounded-full flex items-center justify-center btn-animate transform hover:scale-110 transition-all duration-200">
              X
            </button>
          </div>
        </div>

        <div className="bg-[#141426] rounded-lg p-4 notification">
          <h3 className="text-[20px] font-bold mb-1">Clase 3</h3>
          <p className="text-[14px] text-gray-300 mb-2">Invitación de participación</p>
          <p className="text-[13px] leading-4">
            Querido alumno el profesor Raul Bonaparte lo ha invitado a formar parte de su clase
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <button className="bg-[#FF3B6E] hover:bg-[#e2315f] text-white text-[13px] px-4 py-1 rounded-full font-semibold btn-animate cursor-pointer transform hover:scale-105 transition-all duration-200">
              Rechazar
            </button>
            <button className="bg-[#00E39F] hover:bg-[#00c988] text-white text-[13px] px-4 py-1 rounded-full font-semibold btn-animate cursor-pointer transform hover:scale-105 transition-all duration-200">
              Aceptar
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex justify-between mb-4 fade-in">
          <h2 className="text-white font-semibold text-[15px]">Class Rooms</h2>
          <button 
          onClick={handleCrearClase}
          className="px-4 py-1 rounded bg-green-600 cursor-pointer text-white hover:bg-green-700 mt-4 btn-animate transform hover:scale-102 transition-all duration-200">
            Crear clase
          </button>
          <h2 className="text-white font-semibold text-[15px]">Learned</h2>
        </div>

        <Link
          to="/clase/1"
          className="block bg-[#141426] rounded-lg p-4 mb-2 cursor-pointer hover:bg-[#1f2a4f] tarea-card transition-all duration-300"
        >
          <h3 className="text-[17px] font-semibold">Clase 1</h3>
          <p className="text-[13px] text-gray-300">Profesor Raul Bonaparte</p>
          <p className="text-right text-[17px] font-bold">7 / 20</p>
        </Link>

        <Link
          to="/clase/2"
          className="block bg-[#141426] rounded-lg p-4 cursor-pointer hover:bg-[#1f2a4f] tarea-card transition-all duration-300"
        >
          <h3 className="text-[17px] font-semibold">Clase 2</h3>
          <p className="text-[13px] text-gray-300">Profesor Romina Laceras</p>
          <p className="text-right text-[17px] font-bold">0 / 0</p>
        </Link>
      </div>
    </div>
  );
}