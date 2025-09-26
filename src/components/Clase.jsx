import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BarraLateral from "./BarraLateral";
import Nav from "./nav";
import Cont from "./contenedor";
import ChatWidget from "./chat";
import Llamada from "./llamada";
import { HiChevronLeft } from "react-icons/hi2";
import { AuthContext } from "../context/authcontext";

export default function ClasePage() {
  const [chatAbierto, setChatAbierto] = useState(false);
  const [llamadaActiva, setLlamadaActiva] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menu, setMenu] = useState(false);
  const [clase, setClase] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarInvitacion, setMostrarInvitacion] = useState(false);
  const [emailInvitacion, setEmailInvitacion] = useState("");
  const [cargandoInvitacion, setCargandoInvitacion] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!id || !token || !usuario?.id) return;

    // Obtener datos de la clase
    fetch(`http://localhost:5000/api/clase/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("Clase no encontrada:", data.error);
          navigate("/");
        } else {
          setClase(data);
        }
      })
      .catch((err) => {
        console.error("Error al cargar la clase:", err);
        alert("No se pudo conectar con el servidor");
      });

    // Obtener usuarios de la clase
    fetch(`http://localhost:5000/api/clases/${id}/usuarios`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        const miembros = Array.isArray(data)
          ? data.map((u, i) => ({
              id: u.id,
              nombre: u.nombre,
              estado: u.estado || "conectado",
              foto:
                u.foto ||
                `https://i.pravatar.cc/150?img=${(i % 70) + 1}` // fallback
            }))
          : [];
        setUsuarios(miembros);
      })
      .catch((err) => {
        console.error("Error al cargar usuarios de la clase:", err);
        // No mostrar alerta repetida; console para depuración
      });
  }, [id, usuario, navigate]);

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0B13] text-white">
        <p>Cargando usuario...</p>
      </div>
    );
  }

  const usuarioActual = {
    nombre: usuario.nombre || "Usuario",
    foto:
      "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
  };

  const refrescarUsuarios = async () => {
    const token = localStorage.getItem("token");
    if (!id || !token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/clases/${id}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const miembros = Array.isArray(data)
        ? data.map((u, i) => ({
            id: u.id,
            nombre: u.nombre,
            estado: u.estado || "conectado",
            foto: u.foto || `https://i.pravatar.cc/150?img=${(i % 70) + 1}`
          }))
        : [];
      setUsuarios(miembros);
    } catch (err) {
      console.error("Error al refrescar usuarios:", err);
    }
  };

  const handleInvitarUsuario = async () => {
    const token = localStorage.getItem("token");
    if (!token || !emailInvitacion || !usuario?.id || !clase?.id) {
      alert("Faltan datos para enviar la invitación");
      return;
    }

    setCargandoInvitacion(true);

    try {
      // Buscar usuario por email (ruta que debes tener en backend)
      const resUsuario = await fetch(
        `http://localhost:5000/api/usuarios/email/${encodeURIComponent(emailInvitacion)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!resUsuario.ok) {
        const errBody = await resUsuario.json().catch(() => ({}));
        alert(errBody.error || "Usuario no encontrado");
        setCargandoInvitacion(false);
        return;
      }

      const dataUsuario = await resUsuario.json();
      const usuarioId = dataUsuario.usuario?.id;
      if (!usuarioId) {
        alert("Usuario no encontrado");
        setCargandoInvitacion(false);
        return;
      }

      // Crear notificación de invitación y asignarla al usuario
      const resNoti = await fetch("http://localhost:5000/api/notificaciones/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo: "invitacion",
          titulo: `Invitación a la clase ${clase.nombre}`,
          descripcion: `Has sido invitado a unirte a la clase "${clase.nombre}".`,
          creado_por: usuario.id,
          clase_id: clase.id,
          usuarios: [usuarioId]
        })
      });

      const dataNoti = await resNoti.json();
      if (resNoti.ok && dataNoti.status === "ok") {
        alert("Invitación enviada con éxito");
        setEmailInvitacion("");
        setMostrarInvitacion(false);
        // actualizar lista de usuarios (si tu backend agrega la relación automáticamente al aceptar, quizás no se una hasta que acepte)
        await refrescarUsuarios();
      } else {
        console.error("Error en crear notificación:", dataNoti);
        alert(dataNoti.error || "Error al enviar la invitación");
      }
    } catch (err) {
      console.error("Error al invitar:", err);
      alert("No se pudo enviar la invitación");
    } finally {
      setCargandoInvitacion(false);
    }
  };

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
            <Cont clase={clase} />
          ) : (
            <Llamada usuarioActual={usuarioActual} usuarios={usuarios} onFinalizar={() => setLlamadaActiva(false)} />
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
          <span className="text-sm font-semibold">{clase?.nombre || "Configuración de la clase"}</span>
          <button
            onClick={() => {
              setMenuAbierto(false);
              setMenu(true);
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

          <button
            onClick={() => {
              setMostrarInvitacion(true);
            }}
            className="w-full text-left px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 btn-animate transform hover:translate-x-2"
          >
            Invitar por email
          </button>

          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 btn-animate transform hover:translate-x-2">
            Moderación
          </button>

          <div className="h-2" />

          <button className="w-full text-left px-3 py-2 rounded text-red-400 hover:text-red-300 transition-all duration-200 btn-animate transform hover:translate-x-2">
            Borrar clase
          </button>
        </nav>

        {/* Panel de invitación (simple) */}
        {mostrarInvitacion && (
          <div className="p-4 border-t border-white/10">
            <label className="block text-xs text-gray-300 mb-2">Correo del usuario a invitar</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={emailInvitacion}
              onChange={(e) => setEmailInvitacion(e.target.value)}
              className="w-full p-2 rounded bg-[#1a1a35] border border-gray-700 mb-3 text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={handleInvitarUsuario}
                disabled={cargandoInvitacion}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white disabled:opacity-60"
              >
                {cargandoInvitacion ? "Enviando..." : "Enviar invitación"}
              </button>
              <button
                onClick={() => {
                  setMostrarInvitacion(false);
                  setEmailInvitacion("");
                }}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white"
              >
                Cancelar
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Se buscará el usuario por email y se creará una notificación de tipo invitación.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
