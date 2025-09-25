import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/home";
import ClasePage from "./components/Clase";
import NuevaTarea from "./components/NuevaTarea";
import NuevaClase from "./components/NuevaClase";
import Login from "./components/IniciarSesion";
import RegistroProfesor from './components/RegistroProfesor';
import RegistroAlumno from './components/RegistroAlumno';
import { AuthProvider } from "./context/authcontext";
import "./styles.css";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registro-Profesor" element={<RegistroProfesor />} />
          <Route path="/Registro-Alumno" element={<RegistroAlumno />} />
          <Route path="/clase/:id" element={<ClasePage />} />
          <Route path="/clase/:id/crear-Tarea" element={<NuevaTarea />} /> 
          <Route path="/crear-Clase" element={<NuevaClase />} /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;