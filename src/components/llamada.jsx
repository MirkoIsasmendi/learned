import React, { useState, useEffect, useRef } from "react";
import { HiPhoneXMark, HiVideoCamera } from "react-icons/hi2";
import { TbHeadphonesFilled, TbHeadphonesOff } from "react-icons/tb";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { MdOutlineScreenShare } from "react-icons/md";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Llamada({ usuarioActual, usuarios, onFinalizar }) {
  // Agrego id a usuarioActual para evitar problemas de key
  const principalConId = { ...usuarioActual, id: "usuarioActual" };
  const participantesIniciales = [principalConId, ...usuarios];

  const [principal, setPrincipal] = useState(participantesIniciales[0]);
  const [otros, setOtros] = useState(participantesIniciales.slice(1));

  const [estadosUsuarios, setEstadosUsuarios] = useState(() => {
    const inicial = {};
    participantesIniciales.forEach((u) => {
      inicial[u.id] = { micSilenciado: false, audioSilenciado: false };
    });
    return inicial;
  });

  // Socket for call signaling
  const socketRef = useRef(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    socketRef.current = io(API_URL, { transports: ["websocket", "polling"], auth: token ? { token } : undefined });

    const s = socketRef.current;

    s.on('connect', () => {
      console.log('Call signaling socket connected', s.id);
    });

    s.on('call_request', (data) => {
      console.log('Incoming call_request', data);
      // data: { from, usuario, ... }
      // For now we'll just auto-accept to demonstrate signaling; in production show UI to accept/reject
      // Emit call_response with accept=true
      const response = { to: data.from, from: s.id, accept: true };
      s.emit('call_response', response);
    });

    s.on('call_response', (data) => {
      console.log('Call response', data);
      // handle remote acceptance/rejection
    });

    s.on('webrtc_offer', (data) => {
      console.log('Received offer', data);
      // here you would set remote description and create an answer
    });

    s.on('webrtc_answer', (data) => {
      console.log('Received answer', data);
      // set remote description for answer
    });

    s.on('webrtc_ice_candidate', (data) => {
      console.log('Received ice candidate', data);
      // add candidate to peer connection
    });

    s.on('disconnect', (reason) => {
      console.log('Call signaling socket disconnected', reason);
    });

    return () => {
      if (s) {
        s.removeAllListeners();
        s.disconnect();
      }
      socketRef.current = null;
    };
  }, []);

  const iniciarLlamada = (targetSocketId) => {
    const s = socketRef.current;
    if (!s || !s.connected) {
      console.warn('Socket not connected yet, trying to connect...');
      s && s.connect();
      s && s.once('connect', () => iniciarLlamada(targetSocketId));
      return;
    }

    const payload = {
      to: targetSocketId,
      from: s.id,
      usuario: usuarioActual?.nombre || 'Origin'
    };
    s.emit('call_request', payload);
  };

  const cambiarPrincipal = (nuevoPrincipal) => {
    if (nuevoPrincipal.id === principal.id) return;

    setOtros((prev) => {
      const nuevosOtros = prev.filter((u) => u.id !== nuevoPrincipal.id);
      return [...nuevosOtros, principal];
    });

    setPrincipal(nuevoPrincipal);
  };

  const toggleMicPrincipal = () => {
    const key = principal.id;
    setEstadosUsuarios((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        micSilenciado: !prev[key].micSilenciado,
      },
    }));
  };

  const toggleAudioPrincipal = () => {
    const key = principal.id;
    setEstadosUsuarios((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        audioSilenciado: !prev[key].audioSilenciado,
      },
    }));
  };

  const getFoto = (foto) =>
    foto && foto.trim() !== ""
      ? foto
      : "https://via.placeholder.com/150?text=Usuario";

      const IconosMute = ({ micSilenciado, audioSilenciado }) => (
        <div className="absolute bottom-1 left-1 flex space-x-2">
          {micSilenciado && (
            <FaMicrophoneSlash className="text-gray-700 bg-gray-300 bg-opacity-40 rounded-full text-3xl p-2 pulse" />
          )}
          {audioSilenciado && (
            <TbHeadphonesOff className="text-gray-700 bg-gray-300 bg-opacity-40 rounded-full text-3xl p-2 pulse" />
          )}
        </div>
      );
      
      
  const keyPrincipal = principal.id;
  const estadoUsuario = estadosUsuarios[keyPrincipal] || {
    micSilenciado: false,
    audioSilenciado: false,
  };

  return (
    <div className="flex flex-col h-full bg-[#0F0F13] text-white p-4 fade-in">
      <h2 className="text-2xl font-semibold text-center mb-4 fade-in">Llamada en curso</h2>

      {/* Participante principal */}
      <div className="relative flex-1 flex items-center justify-center bg-[#3a1e13] rounded-lg mb-4 fade-in">
        <img
          src={getFoto(principal.foto)}
          alt={principal.nombre}
          className="w-40 h-40 rounded-full object-cover border-4 border-[#1A1A2E]"
        />
        <IconosMute
          micSilenciado={estadoUsuario.micSilenciado}
          audioSilenciado={estadoUsuario.audioSilenciado}
        />
      </div>

      {/* Participantes secundarios */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {otros.map((user) => {
          const estadoUser = estadosUsuarios[user.id] || {
            micSilenciado: false,
            audioSilenciado: false,
          };
          return (
            <div
              key={user.id}
              onClick={() => cambiarPrincipal(user)}
              className="relative flex items-center justify-center bg-[#3a1e13] rounded-lg h-28 cursor-pointer hover:opacity-80 transition tarea-card"
            >
              <img
                src={getFoto(user.foto)}
                alt={user.nombre}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#1A1A2E]"
              />
              <IconosMute
                micSilenciado={estadoUser.micSilenciado}
                audioSilenciado={estadoUser.audioSilenciado}
              />
            </div>
          );
        })}
      </div>

      {/* Barra de controles */}
      <div className="flex justify-center space-x-4 bg-[#1A1A2E] p-3 rounded-3xl max-w-sm mx-auto fade-in">
        <button
          onClick={toggleAudioPrincipal}
          className={`p-3 rounded-full hover:bg-gray-600 btn-animate transform hover:scale-110 transition-all duration-200 ${
            estadoUsuario.audioSilenciado
              ? "bg-white text-gray-700"
              : "bg-gray-700 text-white"
          }`}
        >
          {estadoUsuario.audioSilenciado ? (
            <TbHeadphonesOff className="text-2xl" />
          ) : (
            <TbHeadphonesFilled className="text-2xl" />
          )}
        </button>
        <button
          onClick={toggleMicPrincipal}
          className={`p-3 rounded-full hover:bg-gray-600 btn-animate transform hover:scale-110 transition-all duration-200 ${
            estadoUsuario.micSilenciado
              ? "bg-white text-gray-700"
              : "bg-gray-700 text-white"
          }`}
        >
          {estadoUsuario.micSilenciado ? (
            <FaMicrophoneSlash className="text-2xl" />
          ) : (
            <FaMicrophone className="text-2xl" />
          )}
        </button>
        <button
          onClick={onFinalizar}
          className="p-3 bg-red-600 rounded-full hover:bg-red-700 btn-animate transform hover:scale-110 transition-all duration-200"
        >
          <HiPhoneXMark className="text-2xl" />
        </button>
        <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 btn-animate transform hover:scale-110 transition-all duration-200">
          <HiVideoCamera className="text-2xl" />
        </button>
        <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 btn-animate transform hover:scale-110 transition-all duration-200">
          <MdOutlineScreenShare className="text-2xl" />
        </button>
      </div>
    </div>
  );
}