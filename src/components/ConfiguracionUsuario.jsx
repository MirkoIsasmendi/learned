import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../context/themecontext";
import { HiChevronLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function ConfiguracionUsuario() {
  const navigate = useNavigate();

  // Siempre inicia en "Mi cuenta" como pediste
  const [seccion, setSeccion] = useState("Mi cuenta");

  // Estado usuario (incluye foto en base64 si existiera)
  const [usuario, setUsuario] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    foto: null, // puede ser URL.createObjectURL(...) temporal o base64 persistente
    correo: "ejemplo@gmail.com",
    telefono: "+542281353290",
    contrasena: "********",
  });

  const [idioma, setIdioma] = useState(localStorage.getItem("idioma") || "es");

  useEffect(() => {
    localStorage.setItem("idioma", idioma);
  }, [idioma]);


  const [voz, setVoz] = useState({
    modoEntrada: "Actividad de voz",
    sensibilidad: 50,
    volumen: 20,
    sensibilidadActiva: false,
    camara: "Cámara 1",
  });

  const [notificaciones, setNotificaciones] = useState({
    internas: false,
    externas: true,
    tiempoInactividad: "10 minutos",
    tipo: "ninguna",
    mostrarMultimedia: false,
    limitarImagenes: false,
    mostrarReacciones: false,
    convertirEmojis: true,
  });

  const secciones = [
    "Mi cuenta",
    "Privacidad y seguridad",
    "Voz y video",
    "Notificaciones",
    "Texto e imagen",
    "Apariencia",
    "Atajos del teclado",
    "Idioma",
  ];

  // ---------- localStorage keys ----------
  const LS_KEYS = {
    USUARIO: "cfg_usuario_v1",
    VOZ: "cfg_voz_v1",
    NOTIFS: "cfg_notifs_v1",
    APARIENCIA: "cfg_apariencia_v1",
    ATAJOS: "cfg_atajos_v1",
  };

  // ---------- util: convertir archivo a base64 ----------
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  // ---------- Apariencia: estado por defecto ----------
  const aparienciaDefault = {
    modoPreview: "oscuro",
    densidad: "predeterminado",
    escalaFuente: 1,
    // chat specific colors (incoming/outgoing) and display toggles
    chatIncoming: "#121217",
    chatOutgoing: "#00FFA0",
    mostrarAvatares: true,
    mostrarTimestamps: true,
  };
  const [apariencia, setApariencia] = useState(aparienciaDefault);

  // ---------- ATAJOS (valores por defecto EXACTOS según tu imagen) ----------
  // Usé las acciones/títulos como indicaste (exactos). Ajustá si querés un label distinto.
  const atajosDefault = {
    "Responder mensaje": "Enter",
    "Eliminar mensaje": "Shift+Delete",
    "Fijar mensaje": "Ctrl+Shift+F",
    "Añadir reacción": "R",
    "Mostrar/ocultar panel": "Ctrl+\\",
    "Abrir búsqueda": "Ctrl+K",
    "Alternar silencio": "Ctrl+Shift+M",
    "Responder llamada": "Ctrl+Enter",
    "Rechazar llamada": "Esc",
    "Obtener ayuda": "F1",
    "Drag and Drop": "Left Click",
    "Entrar a tareas": "Right Click"
  };

  const [atajos, setAtajos] = useState(atajosDefault);

  // ---------- Modal de captura de combinación ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [actionEditing, setActionEditing] = useState(null);
  const [capturedCombo, setCapturedCombo] = useState("");
  const captureRef = useRef(null);

  // ---------- Cargar desde localStorage al montar ----------
  const theme = useTheme();

  useEffect(() => {
    try {
      const storedUsuario = localStorage.getItem(LS_KEYS.USUARIO);
      const storedVoz = localStorage.getItem(LS_KEYS.VOZ);
      const storedNotifs = localStorage.getItem(LS_KEYS.NOTIFS);
      const storedApariencia = localStorage.getItem(LS_KEYS.APARIENCIA);
      const storedAtajos = localStorage.getItem(LS_KEYS.ATAJOS);

      if (storedUsuario) {
        const parsed = JSON.parse(storedUsuario);
        setUsuario((prev) => ({ ...prev, ...parsed }));
      }

      if (storedVoz) {
        setVoz((prev) => ({ ...prev, ...JSON.parse(storedVoz) }));
      }

      if (storedNotifs) {
        setNotificaciones((prev) => ({ ...prev, ...JSON.parse(storedNotifs) }));
      }

      if (storedApariencia) {
        setApariencia((prev) => ({ ...prev, ...JSON.parse(storedApariencia) }));
      }

      if (storedAtajos) {
        setAtajos((prev) => ({ ...prev, ...JSON.parse(storedAtajos) }));
      }
    } catch (e) {
      console.error("Error restaurando configuración desde localStorage:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure apariencia.modoPreview follows ThemeContext mode when available
  useEffect(() => {
    try {
      if (theme && typeof theme.mode === 'string') {
        setApariencia((prev) => {
          if (prev.modoPreview !== theme.mode) return { ...prev, modoPreview: theme.mode };
          return prev;
        });
      }
    } catch (e) {
      // ignore
    }
  }, [theme && theme.mode]);

  // ---------- Sincronizar cambios automáticamente a localStorage ----------
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.USUARIO, JSON.stringify(usuario));
    } catch (e) {
      console.error("Error guardando usuario en localStorage:", e);
    }
  }, [usuario]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.VOZ, JSON.stringify(voz));
    } catch (e) {
      console.error("Error guardando voz en localStorage:", e);
    }
  }, [voz]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.NOTIFS, JSON.stringify(notificaciones));
    } catch (e) {
      console.error("Error guardando notificaciones en localStorage:", e);
    }
  }, [notificaciones]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.APARIENCIA, JSON.stringify(apariencia));
    } catch (e) {
      console.error("Error guardando apariencia en localStorage:", e);
    }
  }, [apariencia]);

  // Apply apariencia colors to global CSS vars so changes affect the whole app immediately
  useEffect(() => {
    try {
      const root = document.documentElement;
      const chatOutgoing = apariencia.chatOutgoing || '#00FFA0';
      const chatIncoming = apariencia.chatIncoming || '#121217';

      root.style.setProperty('--accent', chatOutgoing);
      root.style.setProperty('--success', chatOutgoing);
      root.style.setProperty('--primary', chatIncoming);
      root.style.setProperty('--accent-incoming', chatIncoming);

      // compute readable foreground for primary-like buttons
      const text = (() => {
        try {
          const h = (chatOutgoing || '#000').replace('#', '');
          const r = parseInt(h.substring(0, 2), 16);
          const g = parseInt(h.substring(2, 4), 16);
          const b = parseInt(h.substring(4, 6), 16);
          const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          return luminance > 0.6 ? '#000' : '#fff';
        } catch (e) {
          return '#000';
        }
      })();
      root.style.setProperty('--btn-primary-foreground', text);
    } catch (e) {
      // ignore
    }
  }, [apariencia.chatIncoming, apariencia.chatOutgoing]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.ATAJOS, JSON.stringify(atajos));
    } catch (e) {
      console.error("Error guardando atajos en localStorage:", e);
    }
  }, [atajos]);

  // ---------- Handlers (conservando tus nombres y lógica) ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setUsuario((prev) => ({ ...prev, foto: base64 }));
    } catch (err) {
      console.error("Error convirtiendo la imagen a base64:", err);
    }
  };

  const handleEliminarFoto = () => {
    setUsuario((prev) => ({ ...prev, foto: null }));
  };

  const handleGuardar = () => {
    console.log("Datos guardados (manual):", usuario);
    alert("Datos guardados correctamente ✅");
  };

  const handleVozChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "sensibilidad" || name === "volumen"
        ? Number(value)
        : value;
    setVoz((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleNotifChange = (campo, valor) => {
    setNotificaciones((prev) => ({ ...prev, [campo]: valor }));
  };

  // ---------- Atajos: abrir modal para editar ----------
  const openEditModal = (action) => {
    setActionEditing(action);
    setCapturedCombo(atajos[action] || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActionEditing(null);
    setCapturedCombo("");
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Capturar combinaciones mientras el modal está abierto
  useEffect(() => {
    if (!modalOpen) return;

    const handler = (e) => {
      e.preventDefault();
      // Construir la representación de la combinación
      const parts = [];
      if (e.ctrlKey) parts.push("Ctrl");
      if (e.metaKey) parts.push("Meta");
      if (e.altKey) parts.push("Alt");
      if (e.shiftKey) parts.push("Shift");

      // tecla principal
      let key = e.key;
      // Normalizar teclas especiales
      if (key === " ") key = "Space";
      if (key.length === 1) key = key.toUpperCase();

      // Evitar duplicar modificadores como "Control" en key
      const lower = key.toLowerCase();
      if (["control", "shift", "alt", "meta"].includes(lower)) {
        // si solo pulsó un modificador, representalo
        // (ya está en parts)
      } else {
        parts.push(key);
      }

      const combo = parts.join("+");
      setCapturedCombo(combo);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  const confirmCapturedCombo = () => {
    if (!actionEditing) return;
    const combo = capturedCombo || atajosDefault[actionEditing] || "";
    setAtajos((prev) => ({ ...prev, [actionEditing]: combo }));
    closeModal();
  };

  const resetShortcut = (action) => {
    setAtajos((prev) => ({ ...prev, [action]: atajosDefault[action] }));
  };

  const restoreAllAtajosDefault = () => {
    setAtajos({ ...atajosDefault });
  };

  // helper display: combinación vacía -> Mostrar "Sin asignar"
  const displayCombo = (c) => (c && c.length ? c : "Sin asignar");

  // ---------- Apariencia handlers (mantenidos del bloque anterior) ----------
  const setModoPreview = (modo) =>
    setApariencia((prev) => ({ ...prev, modoPreview: modo }));

  // Ref to mark when a change was initiated by the user (to avoid automatic two-way sync loops)
  const userInitiatedModeChangeRef = useRef(false);

  // integrate with global theme provider if available
  // Only call setMode when the requested mode differs from current theme.mode
  // to avoid a two-way update loop that causes visual flicker.
  // Only call setMode when the requested mode differs from current theme.mode
  // AND the change was initiated by the user (prevents flicker on mount/auto-sync)
  useEffect(() => {
    try {
      if (!theme || typeof theme.setMode !== 'function') return;
      const desired = apariencia.modoPreview || 'oscuro';
      // if theme exposes current mode, avoid calling setMode when equal
      if (typeof theme.mode === 'string' && theme.mode === desired) {
        // reset the user-initiated flag if already in desired state
        userInitiatedModeChangeRef.current = false;
        return;
      }
      if (!userInitiatedModeChangeRef.current) return;
      theme.setMode(desired);
      userInitiatedModeChangeRef.current = false;
    } catch (e) {
      // ignore any errors to avoid breaking the settings UI
    }
  }, [apariencia.modoPreview, theme]);

  const setDensidad = (d) => setApariencia((prev) => ({ ...prev, densidad: d }));

  // removed global 'acento' — chat colors are handled separately

  const setEscalaFuente = (valor) =>
    setApariencia((prev) => ({ ...prev, escalaFuente: Number(valor) }));

  // Chat bubble color handlers and toggles
  const setChatIncoming = (hex) => setApariencia((prev) => ({ ...prev, chatIncoming: hex }));
  const setChatOutgoing = (hex) => setApariencia((prev) => ({ ...prev, chatOutgoing: hex }));
  const toggleMostrarAvatares = () => setApariencia((prev) => ({ ...prev, mostrarAvatares: !prev.mostrarAvatares }));
  const toggleMostrarTimestamps = () => setApariencia((prev) => ({ ...prev, mostrarTimestamps: !prev.mostrarTimestamps }));

  const previewStyle = {
    fontSize: `${apariencia.escalaFuente}rem`,
    ["--acento"]: apariencia.chatOutgoing,
    ["--accent"]: apariencia.chatOutgoing,
  };

  const densidadMap = {
    compacto: { itemGap: "px-1", itemPadding: "py-1 px-2", avatarSize: "w-8 h-8 text-sm" },
    predeterminado: { itemGap: "gap-3", itemPadding: "py-2 px-3", avatarSize: "w-10 h-10 text-base" },
    espacioso: { itemGap: "gap-5", itemPadding: "py-3 px-4", avatarSize: "w-12 h-12 text-lg" },
  };

  // ---------- Render ----------
  return (
    <div className="flex h-screen relative">
      {/* Flecha para volver */}
      <button
        className="absolute top-4 right-4 muted hover:opacity-90 transition-all duration-200"
        onClick={() => navigate("/")}
      >
        <HiChevronLeft className="text-2xl" />
      </button>

      {/* Menú lateral */}
      <div className="w-64 panel p-6">
        <h2 className="text-xl font-bold mb-6">Configuración</h2>
        <ul className="space-y-3">
          {secciones.map((item) => (
            <li
              key={item}
              className={`cursor-pointer ${seccion === item ? "font-semibold accent" : "muted"}`}
              onClick={() => setSeccion(item)}
            >
              {item}
            </li>
          ))}
          {/* Acción de Cerrar sesión dentro del menú */}
          <li
            onClick={handleCerrarSesion}
            className="cursor-pointer text-red-400 hover:text-red-300 mt-4"
            title="Cerrar sesión"
          >
            Cerrar sesión
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* --- MI CUENTA --- */}
        {seccion === "Mi cuenta" && (
          <div className="flex flex-col gap-8 max-w-3xl">
            <div className="flex flex-col items-center">
              <img
                src={
                  usuario.foto ||
                  "https://via.placeholder.com/150?text=Foto"
                }
                alt="Perfil"
                className="w-48 h-48 rounded-full object-cover border-4 border-white/10"
              />
              <label className="mt-3 text-blue-400 cursor-pointer">
                Cambiar foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoChange}
                />
              </label>
              {usuario.foto && (
                <button
                  onClick={handleEliminarFoto}
                  className="text-red-400 mt-1"
                >
                  Eliminar foto
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm">Nombre de usuario</label>
                <input
                  type="text"
                  name="nombre"
                  value={usuario.nombre}
                  onChange={handleChange}
                  className="w-full surface p-2 rounded"
                  placeholder="Nombre"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Descripción</label>
                <textarea
                  name="descripcion"
                  value={usuario.descripcion}
                  onChange={handleChange}
                  className="w-full surface p-2 rounded h-28"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={usuario.ubicacion}
                  onChange={handleChange}
                  className="w-full surface p-2 rounded"
                  placeholder="Ubicación"
                />
              </div>

              <button
                onClick={handleGuardar}
                className="btn btn-primary"
              >
                Guardar cambios
              </button>
              
            </div>
          </div>
        )}

        {/* --- PRIVACIDAD Y SEGURIDAD --- */}
        {seccion === "Privacidad y seguridad" && (
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold mb-6">Seguridad</h2>
            <div className="panel p-6 rounded-lg space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Modificar correo
                </label>
                <input
                  type="email"
                  name="correo"
                  value={usuario.correo}
                  onChange={handleChange}
                  className="w-full surface p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Modificar teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={usuario.telefono}
                  onChange={handleChange}
                  className="w-full surface p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Modificar contraseña
                </label>
                <input
                  type="password"
                  name="contrasena"
                  value={usuario.contrasena}
                  onChange={handleChange}
                  className="w-full surface p-2 rounded"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button className="btn btn-secondary">
                  Desactivar cuenta
                </button>
                <button className="btn btn-danger">
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- VOZ Y VIDEO --- */}
        {seccion === "Voz y video" && (
          <div className="grid grid-cols-2 gap-6 max-w-5xl">
            {/* Voz y Audio */}
            <div className="panel p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Voz y Audio</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Modo de entrada
                  </label>
                  <select
                    name="modoEntrada"
                    value={voz.modoEntrada}
                    onChange={handleVozChange}
                    className="w-full surface p-2 rounded"
                  >
                    <option>Actividad de voz</option>
                    <option>Pulsar para hablar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Sensibilidad de entrada
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="sensibilidad"
                    value={voz.sensibilidad}
                    onChange={handleVozChange}
                    className="w-full accent-green-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Volumen de salida
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="volumen"
                    value={voz.volumen}
                    onChange={handleVozChange}
                    className="w-full accent-green-400"
                  />
                </div>
              </div>
            </div>

            {/* Video */}
            <div className="panel p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Video</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Cámara
                  </label>
                  <select
                    name="camara"
                    value={voz.camara}
                    onChange={handleVozChange}
                    className="w-full surface p-2 rounded"
                  >
                    <option>Cámara 1</option>
                    <option>Cámara 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Muestra de video
                  </label>
                  <div className="surface h-40 flex items-center justify-center rounded">
                    <button className="btn btn-primary">
                      Video de prueba
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- NOTIFICACIONES --- */}
        {seccion === "Notificaciones" && (
          <div className="panel p-6 rounded-lg max-w-3xl">
            <h2 className="text-2xl font-semibold mb-6">Notificaciones</h2>

            {/* Notificaciones integradas */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-400 mb-2">
                Notificaciones integradas
              </h3>
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  Recibir notificaciones dentro de la aplicación
                </span>
                <button
                  onClick={() =>
                    handleNotifChange("internas", !notificaciones.internas)
                  }
                  className={`toggle ${notificaciones.internas ? "toggle-on" : "toggle-off"}`}
                  aria-pressed={notificaciones.internas}
                >
                  <span className="handle" />
                </button>
              </div>
            </div>

            {/* Notificaciones del sistema */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-400 mb-2">
                Notificaciones del sistema
              </h3>
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  Recibir notificaciones externas de la aplicación
                </span>
                <button
                  onClick={() =>
                    handleNotifChange("externas", !notificaciones.externas)
                  }
                  className={`toggle ${notificaciones.externas ? "toggle-on" : "toggle-off"}`}
                  aria-pressed={notificaciones.externas}
                >
                  <span className="handle" />
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Tiempo de inactividad para las notificaciones
                </label>
                <select
                  value={notificaciones.tiempoInactividad}
                  onChange={(e) =>
                    handleNotifChange("tiempoInactividad", e.target.value)
                  }
                  className="w-full surface p-2 rounded"
                >
                  <option>5 minutos</option>
                  <option>10 minutos</option>
                  <option>30 minutos</option>
                  <option>1 hora</option>
                </select>
              </div>
            </div>

            {/* Notificaciones de chat */}
            <div>
              <h3 className="text-sm text-gray-400 mb-3">
                Notificaciones de chat
              </h3>
              <div className="space-y-3">
                {[
                  { id: "todos", label: "Recibir de todos los mensajes" },
                  {
                    id: "menciones",
                    label: "Solo menciones",
                  },
                  { id: "ninguna", label: "Ninguna" },
                ].map((opcion) => (
                  <div key={opcion.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificaciones.tipo === opcion.id}
                      onChange={() => handleNotifChange("tipo", opcion.id)}
                      className="accent-green-400 w-5 h-5 cursor-pointer"
                    />
                    <span>{opcion.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TEXTO E IMAGEN --- */}
        {seccion === "Texto e imagen" && (
          <div className="panel p-6 rounded-lg max-w-3xl">
            <h2 className="text-2xl font-semibold mb-6">Chat</h2>

            {/* Mostrar imágenes, videos y GIFs */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-semibold">Mostrar imágenes, video y gift</p>
                <p className="text-gray-400 text-sm">
                  cuando se envían por enlace
                </p>
              </div>
              <button
                onClick={() =>
                  handleNotifChange(
                    "mostrarMultimedia",
                    !notificaciones.mostrarMultimedia
                  )
                }
                className={`toggle ${notificaciones.mostrarMultimedia ? "toggle-on" : "toggle-off"}`}
                aria-pressed={notificaciones.mostrarMultimedia}
              >
                <span className="handle" />
              </button>
            </div>

            {/* No se mostrarán imágenes subidas */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-semibold">
                  No se mostrarán las imágenes subidas
                </p>
                <p className="text-gray-400 text-sm">
                  directamente a la aplicación si superan los 10 MB
                </p>
              </div>
              <button
                onClick={() =>
                  handleNotifChange(
                    "limitarImagenes",
                    !notificaciones.limitarImagenes
                  )
                }
                className={`toggle ${notificaciones.limitarImagenes ? "toggle-on" : "toggle-off"}`}
                aria-pressed={notificaciones.limitarImagenes}
              >
                <span className="handle" />
              </button>
            </div>

            {/* Subtítulo de Emojis */}
            <h3 className="text-sm text-gray-400 mb-3 mt-8">Emojis</h3>

            {/* Convertir automáticamente :) en emojis */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-semibold">
                  Convertir automáticamente :) en emojis
                </p>
                <p className="text-gray-400 text-sm">
                  Convierte automáticamente los emoticonos escritos en emojis
                  gráficos.
                </p>
              </div>
              <button
                onClick={() =>
                  handleNotifChange(
                    "convertirEmojis",
                    !notificaciones.convertirEmojis
                  )
                }
                className={`toggle ${notificaciones.convertirEmojis ? "toggle-on" : "toggle-off"}`}
              >
                <span className="handle" />
              </button>
            </div>

            {/* Mostrar reacciones en mensajes */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Mostrar reacciones en mensajes</p>
              </div>
              <button
                onClick={() =>
                  handleNotifChange(
                    "mostrarReacciones",
                    !notificaciones.mostrarReacciones
                  )
                }
                className={`toggle ${notificaciones.mostrarReacciones ? "toggle-on" : "toggle-off"}`}
                aria-pressed={notificaciones.mostrarReacciones}
              >
                <span className="handle" />
              </button>
            </div>
          </div>
        )}

        {/* --- APARIENCIA (REEMPLAZADA) --- */}
        {seccion === "Apariencia" && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-semibold mb-2">Apariencia</h2>
            <div className="panel p-6 rounded-lg grid grid-cols-2 gap-6">
              {/* Controles izquierdo */}
              <div className="space-y-6">
                {/* Modo preview (solo preview) */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Modo de la vista previa
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        userInitiatedModeChangeRef.current = true;
                        setModoPreview("oscuro");
                      }}
                      className={`px-3 py-1 rounded text-sm ${apariencia.modoPreview === "oscuro" ? "btn btn-primary font-semibold" : "btn btn-secondary"}`}
                    >
                      Oscuro
                    </button>
                    <button
                      onClick={() => {
                        userInitiatedModeChangeRef.current = true;
                        setModoPreview("claro");
                      }}
                      className={`px-3 py-1 rounded text-sm ${apariencia.modoPreview === "claro" ? "btn btn-primary font-semibold" : "btn btn-secondary"}`}
                    >
                      Claro
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    El modo solo afecta la vista previa dentro de esta sección.
                  </p>
                </div>

                {/* Densidad */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Densidad de la interfaz
                  </label>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: "compacto", label: "Compacto" },
                      { id: "predeterminado", label: "Predeterminado" },
                      { id: "espacioso", label: "Espacioso" },
                    ].map((opt) => (
                      <label key={opt.id} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="densidad"
                          checked={apariencia.densidad === opt.id}
                          onChange={() => setDensidad(opt.id)}
                          className="w-4 h-4 accent-green-400"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* removed global accent palette — use incoming/outgoing colors instead */}

                {/* Escala de la fuente */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Escala de la fuente
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.85"
                      max="1.25"
                      step="0.01"
                      value={apariencia.escalaFuente}
                      onChange={(e) => setEscalaFuente(e.target.value)}
                      className="w-full"
                    />
                    <div className="text-sm w-16 text-right">
                      {apariencia.escalaFuente.toFixed(2)}x
                    </div>
                  </div>
                </div>

                {/* Presets de fuente y colores del chat */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tamaño rápido</label>
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => setEscalaFuente(0.9)} className={`btn ${apariencia.escalaFuente===0.9? 'btn-primary':'btn-secondary'}`}>Pequeña</button>
                    <button onClick={() => setEscalaFuente(1)} className={`btn ${apariencia.escalaFuente===1? 'btn-primary':'btn-secondary'}`}>Media</button>
                    <button onClick={() => setEscalaFuente(1.15)} className={`btn ${apariencia.escalaFuente===1.15? 'btn-primary':'btn-secondary'}`}>Grande</button>
                  </div>

                  <label className="block text-sm text-gray-400 mb-2">Colores del chat</label>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-sm muted">Entrante</div>
                    {["#0F1724","#121217","#F3F4F6","#E6EEF8","#FDE68A"].map((c)=> (
                      <button key={c} title={c} onClick={()=> setChatIncoming(c)} className="w-7 h-7 rounded-full border" style={{background:c, borderColor: apariencia.chatIncoming===c? '#fff':'transparent'}} />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-sm muted">Saliente</div>
                    {["#00FFA0", "#00C2FF", "#FF7A7A", "#FFD166", "#C084FC"].map((c) => (
                      <button key={c} title={c} onClick={() => setChatOutgoing(c)} className="w-7 h-7 rounded-full border" style={{ background: c, borderColor: apariencia.chatOutgoing === c ? '#000' : 'transparent' }} />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-sm muted">Color personalizado</div>
                    <input type="color" value={apariencia.chatIncoming} onChange={(e) => setChatIncoming(e.target.value)} title="Color entrante" className="w-10 h-8 p-0 border rounded" />
                    <input type="color" value={apariencia.chatOutgoing} onChange={(e) => setChatOutgoing(e.target.value)} title="Color saliente" className="w-10 h-8 p-0 border rounded" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Mostrar avatares</p>
                      <p className="text-xs muted">Activa o desactiva los avatares en la vista previa</p>
                    </div>
                    <button onClick={toggleMostrarAvatares} className={`toggle ${apariencia.mostrarAvatares? 'toggle-on':'toggle-off'}`} aria-pressed={apariencia.mostrarAvatares}><span className="handle"/></button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-sm font-semibold">Mostrar timestamps</p>
                      <p className="text-xs muted">Muestra / oculta marcas de tiempo en mensajes</p>
                    </div>
                    <button onClick={toggleMostrarTimestamps} className={`toggle ${apariencia.mostrarTimestamps? 'toggle-on':'toggle-off'}`} aria-pressed={apariencia.mostrarTimestamps}><span className="handle"/></button>
                  </div>
                </div>
              </div>

              {/* Preview derecho */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Vista previa en vivo
                </label>
                <div
                  className="rounded-lg border card p-4"
                  style={{
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    ...previewStyle,
                  }}
                >
                    <div
                      style={{
                        ["--acento"]: apariencia.chatOutgoing,
                      }}
                      className="space-y-4"
                    >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {apariencia.mostrarAvatares ? (
                          <div
                            style={{
                              background: 'var(--panel-01)',
                              borderRadius: '9999px',
                            }}
                            className={`${densidadMap[apariencia.densidad].avatarSize} flex items-center justify-center`}
                          >
                            <span style={{ color: 'var(--text)' }}>U</span>
                          </div>
                        ) : (
                          <div className={`${densidadMap[apariencia.densidad].avatarSize}`} />
                        )}
                        <div>
                          <div className="font-semibold text-base">
                            Usuario de prueba
                          </div>
                          <div className="text-sm muted">
                            en línea
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          style={{
                            background: 'var(--accent)',
                            color: 'var(--btn-primary-foreground, #000)',
                          }}
                          className="px-3 py-1 rounded btn btn-primary"
                        >
                          Conectar
                        </button>
                      </div>
                    </div>

                    <div className={`flex flex-col ${densidadMap[apariencia.densidad].itemGap}`}>
                      <div
                        className={`rounded ${densidadMap[apariencia.densidad].itemPadding}`}
                        style={{
                          background: 'var(--accent-incoming, ' + (apariencia.chatIncoming || 'var(--surface-2)') + ')',
                          color: 'var(--text)',
                          alignSelf: 'flex-start',
                          maxWidth: '75%',
                        }}
                      >
                        <div className="text-sm" style={{ fontSize: '0.95em' }}>{apariencia.mostrarTimestamps ? <span className="text-xs muted mr-2">10:12</span> : null}Hola! este es un ejemplo de mensaje.</div>
                      </div>

                      <div
                        className={`rounded ${densidadMap[apariencia.densidad].itemPadding}`}
                        style={{
                          background: 'var(--accent, ' + (apariencia.chatOutgoing || '#00FFA0') + ')',
                          color: 'var(--btn-primary-foreground, #000)',
                          alignSelf: 'flex-end',
                          maxWidth: '70%',
                        }}
                      >
                        <div className="text-sm" style={{ fontSize: '0.95em' }}>{apariencia.mostrarTimestamps ? <span className="text-xs muted mr-2">10:13</span> : null}Respuesta.</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        placeholder="Escribir mensaje..."
                        className="flex-1 rounded py-2 px-3"
                        style={{
                          background: apariencia.modoPreview === "oscuro" ? "#0F0F12" : "#F3F4F6",
                          color: apariencia.modoPreview === "oscuro" ? "#E6E6E6" : "#111827",
                          border: "1px solid rgba(255,255,255,0.03)",
                        }}
                      />
                      <button className="btn btn-primary">Enviar</button>
                    </div>

                    <div className="text-xs" style={{ color: apariencia.modoPreview === "oscuro" ? "#9CA3AF" : "#6B7280" }}>
                      Densidad: <span className="font-medium">{apariencia.densidad}</span> · Escala: <span className="font-medium">{apariencia.escalaFuente.toFixed(2)}x</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      // mark as user-initiated so restoring defaults updates global theme if needed
                      userInitiatedModeChangeRef.current = true;
                      setApariencia(aparienciaDefault);
                    }}
                    className="btn btn-secondary text-sm"
                  >
                    Restaurar por defecto
                  </button>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Nota: los cambios en esta sección se guardan automáticamente y afectan la vista previa local. El resto de la aplicación conserva su estilo actual.
            </p>
          </div>
        )}

        {/* --- ATAJOS DEL TECLADO (INTEGRADO) --- */}
        {seccion === "Atajos del teclado" && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4">Atajos del teclado</h2>

            <div className="panel p-6 rounded-lg">
              <p className="text-gray-400 mb-4">Haz clic en una combinación para editarla. Se abrirá un modal que capturará la nueva combinación.</p>

              {/* Lista de atajos */}
              <div className="space-y-3">
                {Object.keys(atajos).map((action) => (
                  <div
                    key={action}
                    className="flex items-center justify-between panel p-3 rounded hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="font-medium">{action}</div>
                      <div className="text-sm muted">Acción en la aplicación</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(action)}
                        className="btn btn-secondary"
                        title="Editar atajo"
                      >
                        <span className="text-sm font-medium">{displayCombo(atajos[action])}</span>
                      </button>

                      <button
                        onClick={() => resetShortcut(action)}
                        className="btn btn-ghost"
                        title="Restaurar atajo por defecto"
                      >
                        Restaurar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Acciones generales */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-400">Puedes restaurar todos los atajos a sus valores por defecto.</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={restoreAllAtajosDefault}
                    className="btn btn-secondary"
                  >
                    Restaurar todo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- RESTO (Idioma etc) --- */}
        {seccion === "Idioma" && (
          <div className="panel p-6 rounded-xl border max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-2">Idioma</h2>
            <p className="text-sm text-gray-400 mb-6">Selecciona el idioma de la aplicación</p>

            <div className="space-y-2">
              {[
                { code: "de", native: "Deutsch", translation: "Alemán" },
                { code: "en", native: "English", translation: "Inglés" },
                { code: "es", native: "Español", translation: "Español" },
                { code: "fr", native: "Français", translation: "Francés" },
                { code: "it", native: "Italiano", translation: "Italiano" },
                { code: "nl", native: "Nederlands", translation: "Holandés" },
                { code: "no", native: "Norsk", translation: "Noruego" },
                { code: "pl", native: "Polski", translation: "Polaco" },
              ].map((lang) => (
                <label
                  key={lang.code}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 border ${idioma === lang.code
                    ? "bg-emerald-500/10 border-emerald-400"
                    : "panel"
                    }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.native}</span>
                    <span className="text-xs text-gray-400">{lang.translation}</span>
                  </div>

                  <input
                    type="radio"
                    name="idioma"
                    checked={idioma === lang.code}
                    onChange={() => setIdioma(lang.code)}
                    className="appearance-none w-4 h-4 rounded-full border border-gray-500 checked:border-emerald-400 checked:bg-emerald-400 cursor-pointer transition-all duration-200"
                  />
                </label>
              ))}
            </div>

            <div className="pt-6 border-t border-[#2a2a3a] mt-6 text-sm text-gray-400">
              Idioma actual:{" "}
              <span className="text-emerald-400 font-semibold uppercase">{idioma}</span>
            </div>
          </div>
        )}


      </div>

      {/* ---------------------- MODAL CAPTURA ---------------------- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/60"
            onClick={closeModal}
          />

          {/* modal box */}
          <div className="relative z-10 w-full max-w-lg panel border rounded-lg p-6 shadow-lg transform transition-all">
            <h3 className="text-lg font-semibold mb-2">Presioná la nueva combinación</h3>
            <p className="text-sm text-gray-400 mb-4">Atajo: <span className="font-medium">{actionEditing}</span></p>

            <div className="mb-4">
              <div className="card p-4 rounded text-center text-xl font-mono">
                {capturedCombo || "Esperando teclas..."}
              </div>
              <p className="text-xs text-gray-400 mt-2">Soporta Ctrl, Shift, Alt, Meta y teclas normales. Presioná la combinación que quieras asignar.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCapturedCombo}
                className="btn btn-primary"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
