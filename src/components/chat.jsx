import React, { useState, useEffect } from "react";

export default function ChatWidget({ isOpen, onClose }) {
  const [input, setInput] = useState("");
  const [visible, setVisible] = useState(false);
  const [animacion, setAnimacion] = useState("");
  const [mensajes, setMensajes] = useState([
    {
      from: "bot",
      text: "¡Hola! ¿En qué puedo ayudarte?",
      usuario: "Asistente",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ]);

  const enviarMensaje = () => {
    if (!input.trim()) return;

    const nuevoMensaje = {
      from: "user",
      text: input,
      usuario: "Yo",
      avatar: "https://i.pravatar.cc/150?img=12", // tu avatar
    };

    setMensajes([...mensajes, nuevoMensaje]);
    setInput("");

    setTimeout(() => {
      setMensajes((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Entendido 👍",
          usuario: "Asistente",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
      ]);
    }, 800);
  };

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimacion("slide-in-right");
    } else {
      setAnimacion("slide-out-right");
      setTimeout(() => setVisible(false), 300); // duración de la animación
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-[#1A1A2E] text-black shadow-lg border-l transition-transform duration-300 z-50 ${animacion ? animacion : "translate-x-full"}`}
    >
      <div className="flex flex-col h-full">
        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
          {mensajes.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end chat-message ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {msg.from !== "user" && (
                <img
                  src={msg.avatar}
                  alt={msg.usuario}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  msg.from === "user"
                    ? "bg-green-200 text-black rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                {msg.from !== "user" && (
                  <div className="text-xs text-gray-600 font-semibold mb-1">
                    {msg.usuario}
                  </div>
                )}
                {msg.text}
              </div>
              {msg.from === "user" && (
                <img
                  src={msg.avatar}
                  alt={msg.usuario}
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          ))}
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