import React from "react";
import { HiOutlineAnnotation, HiAnnotation } from "react-icons/hi";
import { BsHexagon, BsFillHexagonFill } from "react-icons/bs";
import { HiOutlinePhone } from "react-icons/hi";
import { HiPhone } from "react-icons/hi2";

const estadosColor = {
  conectado: "bg-green-500",
  ausente: "bg-yellow-400",
  "no molestar": "bg-red-500",
  desconectado: "bg-gray-400",
};

export default function BarraLateral({
  usuarioActual,
  usuarios,
  chatAbierto,
  onChatToggle,
  llamadaActiva,
  onLlamadaToggle,
  onMenuToggle,
  menuAbierto,
}) {
  return (
    <div className="w-[21vw] bg-[#0F0F13] text-white h-screen flex flex-col justify-between border-r border-[#F3F3F3] relative z-20 sidebar-transition">
      <div>
        <div className="flex items-center p-4 border-b border-[#F3F3F3] fade-in">
          <img
            src={usuarioActual.foto}
            alt="Perfil"
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <p className="font-semibold">{usuarioActual.nombre}</p>
          </div>
        </div>

        <div className="border-t border-[#F3F3F3] px-4 pt-4 fade-in">
          <h2 className="text-sm uppercase">Usuarios conectados</h2>
          <hr className="w-full border-t border-dashed border-[#F3F3F3] my-4" />
        </div>

        <ul className="space-y-3 px-4 overflow-y-auto">
          {usuarios.map((user, index) => (
            <li 
              key={user.id} 
              className="flex items-center fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <img
                  src={user.foto}
                  alt={user.nombre}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#F3F3F3] ${estadosColor[user.estado]} pulse`}
                />
              </div>
              <span className="ml-3 text-sm">{user.nombre}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[#F3F3F3] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onLlamadaToggle} 
            className="cursor-pointer btn-animate transform hover:scale-110 transition-all duration-200"
          >
            {llamadaActiva ? (
              <HiPhone className="text-3xl text-white pulse" />
            ) : (
              <HiOutlinePhone className="text-3xl hover:text-gray-400" />
            )}
          </button>

          <button 
            onClick={onChatToggle} 
            className="cursor-pointer btn-animate transform hover:scale-110 transition-all duration-200"
          >
            {chatAbierto ? (
              <HiAnnotation className="text-3xl text-white pulse" />
            ) : (
              <HiOutlineAnnotation className="text-3xl hover:text-gray-400" />
            )}
          </button>
        </div>

        
        <button 
          onClick={onMenuToggle} 
          className="cursor-pointer btn-animate transform hover:scale-110 transition-all duration-200"
        >
          {menuAbierto ? (
            <BsFillHexagonFill className="text-2xl text-white pulse" />
          ) : (
            <BsHexagon className="text-2xl hover:text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
}