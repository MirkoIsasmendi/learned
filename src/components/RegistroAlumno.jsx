import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function validarPassword(password) {
  const errores = [];

  if (password.length < 8) {
    errores.push("Debe tener al menos 8 caracteres.");
  }
  if (!/[A-Z]/.test(password)) {
    errores.push("Debe contener al menos una letra mayúscula.");
  }
  if (!/[a-z]/.test(password)) {
    errores.push("Debe contener al menos una letra minúscula.");
  }
  if (!/\d/.test(password)) {
    errores.push("Debe contener al menos un número.");
  }
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
    errores.push("Debe contener al menos un carácter especial.");
  }

  return errores;
}

export default function RegistroAlumno({ onAuthSuccess }) {
  const navigate = useNavigate(); // <-- Hook para navegar
  const [formData, setFormData] = useState({
    nombre: "",
    mail: "",
    password: "",
    confirmPassword: ""
  });
  const [confirmationToken, setConfirmationToken] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const erroresPassword = validarPassword(formData.password);
    if (erroresPassword.length > 0) {
      alert("Error en la contraseña:\n" + erroresPassword.join("\n"));
      return;
    }

    try {
  const response = await fetch(`${API_URL}/api/register/alumno`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.mail,
          password: formData.password
        })
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Respuesta inválida del servidor:", text);
        alert("Error inesperado del servidor");
        return;
      }

      if (response.ok) {
        // Si el backend devuelve un token para verificar por email
        if (data && data.token) {
          setConfirmationToken(data.token);
          setAwaitingConfirmation(true);
          alert("Se ha enviado un código a tu correo. Ingresalo para completar el registro.");
        } else {
          console.log("Registro exitoso:", data);
          navigate("/Login");
        }
      } else {
        console.error("Error en el registro:", data.error);
        alert(data.error || "No se pudo completar el registro");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  const handleConfirm = async () => {
    if (!confirmationToken) return;
    if (!confirmationCode.trim()) {
      alert("Ingresa el código de verificación");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/register/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: confirmationToken, codigo: confirmationCode.trim() })
      });

      const body = await res.json().catch(() => ({}));
      if (res.ok && body.status === "ok") {
        alert("Registro confirmado. Ya puedes iniciar sesión.");
        navigate("/Login");
      } else {
        alert(body.error || "Código inválido o expirado");
      }
    } catch (err) {
      console.error("Error al confirmar registro:", err);
      alert("No se pudo confirmar el registro");
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D0D1A] px-4">
      <div className="bg-[#12122B] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-center fade-in">
        <h2 className="text-white text-2xl font-bold">Registrarse</h2>
        <p className="text-gray-400">Alumno</p>

        {awaitingConfirmation ? (
          <div className="mt-6">
            <p className="text-sm text-gray-300 mb-2">Ingresa el código que recibiste por email</p>
            <input
              type="text"
              name="confirmationCode"
              placeholder="Código de verificación"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2A2A45] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
              >
                Confirmar código
              </button>
              <button
                onClick={() => {
                  setAwaitingConfirmation(false);
                  setConfirmationToken(null);
                  setConfirmationCode("");
                }}
                className="px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#2A2A45] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
          />
          <input
            type="email"
            name="mail"
            placeholder="Correo electrónico"
            value={formData.mail}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#2A2A45] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#2A2A45] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#2A2A45] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 fade-in"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] btn-animate"
          >
            CONFIRMAR
          </button>
  </form>
  )}

  <div className="mt-6 flex flex-col sm:flex-row justify-between text-white text-sm font-medium gap-2 sm:gap-0">
          <span
            className="cursor-pointer hover:text-gray-300"
            onClick={() => navigate("/Registro-Profesor")}
          >
            ¿Eres un profesor?
          </span>
          <span
            className="cursor-pointer hover:text-gray-300"
            onClick={() => navigate("/Login")}
          >
            ¿Ya tienes cuenta?
          </span>
        </div>
      </div>
    </div>
  );

}
