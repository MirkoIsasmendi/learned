import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsHexagon } from "react-icons/bs";
import { AuthContext } from "../context/authcontext";

export default function Home() {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  const [notificaciones, setNotificaciones] = useState([]);
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || usuario === null) return;
    if (!usuario?.id) {
      navigate("/login");
      return;
    }
    cargarDatos();
  }, [usuario, navigate]);

  const cargarDatos = async () => {
    const token = localStorage.getItem("token");
    if (!token || !usuario?.id) return;
    setCargando(true);
    try {
      const [resNotis, resClases] = await Promise.all([
        fetch(`http://localhost:5000/api/notificaciones/${usuario.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:5000/api/clases/${usuario.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (resNotis.ok) {
        const n = await resNotis.json();
        setNotificaciones(Array.isArray(n) ? n : []);
      } else {
        console.error("Error al obtener notificaciones", resNotis.status);
      }

      if (resClases.ok) {
        const c = await resClases.json();
        setClases(Array.isArray(c) ? c : []);
      } else {
        console.error("Error al obtener clases", resClases.status);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setCargando(false);
    }
  };

  // Aceptar invitación: une al usuario a la clase y elimina la notificación (backend lo hace)
  const handleAceptar = async (asignacion_id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notificaciones/respond/${asignacion_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: "aceptar" })
      });

      const data = await res.json();
      if (res.ok && data.status === "ok") {
        // refrescar notificaciones y clases porque ahora puede haber una nueva clase
        await cargarDatos();
      } else {
        console.error("Error al aceptar invitación:", data);
        alert(data.error || "No se pudo aceptar la invitación");
      }
    } catch (err) {
      console.error("Error de red al aceptar:", err);
      alert("Error de red al aceptar la invitación");
    }
  };

  // Rechazar invitación: eliminar asignación (backend elimina)
  const handleRechazar = async (asignacion_id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notificaciones/respond/${asignacion_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: "rechazar" })
      });

      const data = await res.json();
      if (res.ok && data.status === "ok") {
        // quitar notificación localmente
        setNotificaciones((prev) => prev.filter((n) => n.asignacion_id !== asignacion_id));
      } else {
        console.error("Error al rechazar:", data);
        alert(data.error || "No se pudo rechazar la invitación");
      }
    } catch (err) {
      console.error("Error de red al rechazar:", err);
      alert("Error de red al rechazar la invitación");
    }
  };

  // Cerrar notificación normal (eliminar asignación)
  const handleEliminar = async (asignacion_id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!window.confirm("¿Eliminar esta notificación?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notificaciones/asignacion/${asignacion_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.status === "ok") {
        setNotificaciones((prev) => prev.filter((n) => n.asignacion_id !== asignacion_id));
      } else {
        console.error("Error al eliminar notificación:", data);
        alert(data.error || "No se pudo eliminar la notificación");
      }
    } catch (err) {
      console.error("Error de red al eliminar:", err);
      alert("Error de red al eliminar la notificación");
    }
  };

  const handleCrearClase = () => navigate("/crear-Clase");
  const handleUnirmeClase = () => navigate("/unirme-Clase");
  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0B13] text-white">
        <p>Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0B0B13] text-white font-sans">
      {/* Sidebar izquierdo */}
      <div className="w-[320px] border-r border-[#1E1E2D] flex flex-col justify-between">
        <div className="p-4 flex-1 overflow-y-auto max-h-[calc(100vh-80px)]">
          <h2 className="text-white font-semibold text-[15px] mb-4 fade-in">Notifications</h2>

          {cargando ? (
            <p className="text-gray-400 text-sm">Cargando...</p>
          ) : notificaciones.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay notificaciones</p>
          ) : (
            notificaciones.map((noti) => (
              <div key={noti.asignacion_id} className="bg-[#141426] rounded-lg p-4 mb-4">
                <h3 className="text-[20px] font-bold mb-1">{noti.titulo}</h3>
                <p className="text-[14px] text-gray-300 mb-2">{noti.tipo}</p>
                <p className="text-[13px] leading-4">{noti.descripcion}</p>
                <div className="flex justify-end mt-2 space-x-2">
                  {noti.tipo === "invitacion" ? (
                    <>
                      <button
                        onClick={() => handleAceptar(noti.asignacion_id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-bold hover:scale-110 transition-all duration-200"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleRechazar(noti.asignacion_id)}
                        className="bg-[#FF3B6E] hover:bg-[#e2315f] text-white px-3 py-1 rounded-lg font-bold hover:scale-110 transition-all duration-200"
                      >
                        Rechazar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEliminar(noti.asignacion_id)}
                      className="bg-[#FF3B6E] hover:bg-[#e2315f] text-white font-bold w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-[#0B0B13] border-t border-[#1E1E2D] p-3 flex items-center justify-between">
          <BsHexagon className="text-2xl text-white hover:text-gray-400 cursor-pointer" />
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-semibold">{usuario.nombre}</span>
            <img
              src="https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
              alt="Usuario"
              className="w-10 h-10 rounded-full object-cover"
            />
            <button
              onClick={handleCerrarSesion}
              className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-all duration-200"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido derecho */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between mb-4 fade-in">
          <h2 className="text-white font-semibold text-[15px]">Class Rooms</h2>
          <h2 className="text-white font-semibold text-[15px]">Learned</h2>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {clases.length === 0 ? (
            <p className="text-gray-400 text-sm">No estás en ninguna clase</p>
          ) : (
            clases.map((clase) => (
              <Link
                key={clase.id}
                to={`/clase/${clase.id}`}
                className="block bg-[#141426] rounded-lg p-4 mb-2 cursor-pointer hover:bg-[#1f2a4f] transition-all duration-300"
              >
                <h3 className="text-[17px] font-semibold">{clase.nombre}</h3>
                <p className="text-[13px] text-gray-300">Profesor {clase.profesor_nombre}</p>
                <p className="text-right text-[17px] font-bold">?</p>
              </Link>
            ))
          )}
        </div>

        <div className="border-t border-white flex gap-8 mt-4 justify-end pt-4">
          <button
            onClick={handleUnirmeClase}
            className="px-4 py-2 rounded bg-[#2C2C3E] text-white hover:bg-[#3d3d52] transition-all duration-200"
          >
            Unirme a una clase
          </button>

          {usuario.rol === "profesor" && (
            <button
              onClick={handleCrearClase}
              className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 transition-all duration-200"
            >
              Crear clase
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
