import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BarraLateral from "./BarraLateral";
import Nav from "./nav";
import Cont from "./contenedor";
import ChatWidget from "./chat";
import Llamada from "./llamada";
import { HiChevronLeft } from "react-icons/hi2";



export default function ClasePage() {
  const [chatAbierto, setChatAbierto] = useState(false);
  const [llamadaActiva, setLlamadaActiva] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false); 
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  const usuarioActual = {
    nombre: "Bautista",
    foto: "https://i.pravatar.cc/150?img=12",
  };

  const usuarios = [
    { id: 1, nombre: "Lucía", foto: "https://i.pravatar.cc/150?img=32", estado: "conectado" },
    { id: 2, nombre: "Mateo", foto: "https://i.pravatar.cc/150?img=15", estado: "ausente" },
    { id: 3, nombre: "Sofía", foto: "https://i.pravatar.cc/150?img=45", estado: "no molestar" },
    { id: 4, nombre: "Tomás", foto: "https://i.pravatar.cc/150?img=18", estado: "desconectado" },
    { id: 5, nombre: "Nico", foto: "https://i.pravatar.cc/150?img=1", estado: "desconectado" },
    { id: 6, nombre: "Agus", foto: "https://i.pravatar.cc/150?img=22", estado: "conectado" },
  ];

  return (
    <div className="flex h-screen overflow-hidden relative">
     
      <BarraLateral
        usuarioActual={usuarioActual}
        usuarios={usuarios}
        chatAbierto={chatAbierto}
        llamadaActiva={llamadaActiva}
        onChatToggle={() => setChatAbierto(!chatAbierto)}
        onLlamadaToggle={() => setLlamadaActiva(!llamadaActiva)}
        onMenuToggle={() => setMenuAbierto(!menuAbierto)}
        menuAbierto={menuAbierto}
      />

   
      <div className="flex-1 flex flex-col">
        <Nav />
        <div className="flex-1 overflow-auto overflow-x-none">
          {!llamadaActiva ? (
            <Cont />
          ) : (
            <Llamada
              usuarioActual={usuarioActual}
              usuarios={usuarios}
              onFinalizar={() => setLlamadaActiva(false)}
            />
          )}
        </div>
      </div>

     
      <ChatWidget isOpen={chatAbierto} onClose={() => setChatAbierto(false)} />

    
      <aside
        className={`absolute left-72 top-[60px] bottom-0 w-80 
        bg-[#14182A] text-white shadow-2xl
        transform transition-transform duration-300 ease-out
        ${menuAbierto ? "translate-x-0 slide-in-left" : menu ? "slide-out-left" : "-translate-x-full"}
        z-10 overflow-y-auto`}
        aria-hidden={!menuAbierto}
      >
       
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between fade-in">
          <span className="text-sm font-semibold">Configuración de la clase</span>
          <button
            onClick={() => {
              setMenuAbierto(false) 
              setMenu(true)
            }}
            className="p-1 rounded hover:bg-white/10 focus:outline-none btn-animate transform hover:scale-110 transition-all duration-200"
            aria-label="Cerrar panel"
          >
            <HiChevronLeft className="text-lg" />
          </button>
        </div>

       
        <nav className="p-4 space-y-3">
          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 btn-animate transform hover:translate-x-2">
            Vista previa
          </button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 btn-animate transform hover:translate-x-2">
            Usuarios
          </button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 btn-animate transform hover:translate-x-2">
            Moderación
          </button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 btn-animate transform hover:translate-x-2">
            Invitaciones
          </button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 btn-animate transform hover:translate-x-2">
            Usuarios expulsados
          </button>

          <div className="h-2" />

          <button className="w-full text-left px-3 py-2 rounded text-red-400 hover:text-red-300 transition-all duration-200 btn-animate transform hover:translate-x-2">
            Borrar clase
          </button>
        </nav>
      </aside>
    </div>
  );
}