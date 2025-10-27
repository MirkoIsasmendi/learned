import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ChatWidget({ isOpen, onClose }) {
  const [input, setInput] = useState("");
  const [visible, setVisible] = useState(false);
  const [animacion, setAnimacion] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const socketRef = useRef(null);
  const mensajesRef = useRef(null);
  const mensajesEndRef = useRef(null);

  // Parse token to get current user id and name (no verification, just decode payload)
  const parseJwt = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
      let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const jwtPayload = parseJwt(token);
  const myUserId = jwtPayload?.usuario_id || null;
  const myName = jwtPayload?.nombre || null;

  // Crear y gestionar socket una sola vez
  useEffect(() => {
    // inicializar socket y pasar token en auth (si existe)
    socketRef.current = io(API_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: token ? { token } : undefined
    });

    const s = socketRef.current;

  const onMessage = (data) => {
      // Normalizar mensaje: marcar si es mio comparando usuario_id del payload con el token
      try {
        const isMine = data && data.usuario_id && myUserId && data.usuario_id === myUserId;
        const msg = {
          ...data,
          from: isMine ? "user" : "other",
          usuario: data.usuario || (isMine ? myName || "Yo" : data.usuario || "Anon"),
          avatar: data.avatar || (isMine ? "https://i.pravatar.cc/150?img=12" : "https://i.pravatar.cc/150?img=5")
        };
        setMensajes((prev) => [...prev, msg]);
      } catch (e) {
        // si algo falla, aún añadir el mensaje bruto
        setMensajes((prev) => [...prev, data]);
      }
    };

    s.on("connect", () => {
      console.log("Socket conectado", s.id);
    });

    s.on("chat_message", onMessage);

    s.on("disconnect", (reason) => {
      console.log("Socket desconectado:", reason);
    });

    s.on("connect_error", (err) => {
      console.warn("Error de conexión socket:", err);
    });

    return () => {
      s.off("chat_message", onMessage);
      s.removeAllListeners();
      s.disconnect();
      socketRef.current = null;
    };
  }, [myUserId, myName, token]);

  // Auto-scroll to bottom when mensajes change
  useEffect(() => {
    if (mensajesEndRef.current) {
      mensajesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [mensajes]);

  // Animación de apertura/cierre
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimacion("slide-in-right");
    } else {
      setAnimacion("slide-out-right");
      setTimeout(() => setVisible(false), 300);
    }
  }, [isOpen]);

  const enviarMensaje = () => {
    if (!input.trim()) return;

    const nuevoMensaje = {
      from: "user",
      text: input,
      usuario: "Yo",
      avatar: "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
    };

    // Attach current user id and name so server can broadcast it and clients can identify owner
    const payload = {
      ...nuevoMensaje,
      usuario_id: myUserId,
      usuario: myName || nuevoMensaje.usuario
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("chat_message", payload);
    } else if (socketRef.current) {
      // intentar reconectar, y emitir luego
      socketRef.current.connect();
      socketRef.current.once("connect", () => socketRef.current.emit("chat_message", payload));
    }

    setInput("");
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-[#1A1A2E] text-black shadow-lg border-l transition-transform duration-300 z-50 ${animacion}`}
    >
      <div className="flex flex-col h-full">
        {/* Mensajes */}
        <div ref={mensajesRef} className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
          {mensajes.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.from === "user" ? "self" : "other"}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {msg.from !== "user" ? (
                <div className="flex items-start gap-3">
                  <img src={msg.avatar} alt={msg.usuario} className="w-8 h-8 rounded-full mr-2" />
                  <div>
                    <div className="text-xs text-gray-400 font-semibold mb-1">{msg.usuario}</div>
                    <div className="bg-gray-200 text-black rounded-bl-none rounded-lg px-3 py-2 text-sm">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-end justify-end">
                  <div className="bg-green-200 text-black rounded-br-none rounded-lg px-3 py-2 text-sm">
                    {msg.text}
                  </div>
                  <img src={msg.avatar} alt={msg.usuario} className="w-8 h-8 rounded-full ml-2" />
                </div>
              )}
            </div>
          ))}
          <div ref={mensajesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[#F3F3F3] p-4 flex gap-2 bg-[#1A1A2E]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-white border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
          <button
            onClick={enviarMensaje}
            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 btn-animate transform hover:scale-105 transition-all duration-200"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
