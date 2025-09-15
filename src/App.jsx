import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/home";
import ClasePage from "./components/Clase";
import NuevaTarea from "./components/NuevaTarea";
import NuevaClase from "./components/NuevaClase";
import "./styles.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clase/:id" element={<ClasePage />} />
        <Route path="/clase/crear-Tarea" element={<NuevaTarea />} /> 
        <Route path="/crear-Clase" element={<NuevaClase />} /> 
      </Routes>
    </Router>
  );
}

export default App;