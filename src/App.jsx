import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/home";
import ClasePage from "./components/Clase";
import NuevaTarea from "./components/NuevaTarea";
import NuevaClase from "./components/NuevaClase";
import Login from "./components/IniciarSesion";
import "./styles.css";


function App() {
  const usuarioTest = {
    id: "prof002",
    nombre: "Profesor Ejemplo",
    foto: "/placeholder.jpg",
    rol: "profesor"
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/clase/:id" element={<ClasePage />} />
        <Route path="/clase/:id/crear-Tarea" element={<NuevaTarea />} /> 
        <Route path="/crear-Clase" element={<NuevaClase />} /> 
      </Routes>
    </Router>
  );
}

export default App;