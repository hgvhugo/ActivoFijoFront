import { useState } from "react";
import gobmx_logo from "./assets/gobmx_logo.svg";
import hacienda_logo from "./assets/hacienda_logo.svg";
import anam_logo from "./assets/anam_logo.svg";
import { Routes, Route, Link } from "react-router-dom";
import { NavLink } from "@mantine/core";
import { IconGauge, IconFingerprint } from "@tabler/icons-react";
import Menu from "./components/Menu.jsx";
import RecepcionBienes from "./pages/RecepcionBienes.jsx";
import AsignacionBienes from "./pages/AsignacionBienes.jsx";
import Firma from "./components/Firma/Firma.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FirmaAsignacionBienes from "./components/AsignacionBienes/FirmaAsignacionBienes.jsx";
import ResguardoBienes from "./pages/ResguardoBienes.jsx";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <header className="header-principal">
        <img src={gobmx_logo} className="img-header" />
        <img src={hacienda_logo} className="img-header" />
        <img src={anam_logo} className="img-header" />
        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776; {/* Símbolo de hamburguesa */}
        </button>
      </header>
      <div className="contenedor-principal">
        <div className="menu-principal">
          <Menu />
        </div>
        <div className="divider" />
        <div className="contenedor-padre">
          <div className="contenedor-hijo">
             <Routes>
              <Route path="/recepcionBienes" element={<RecepcionBienes />} />
              <Route path="/asignacionBienes" element={<AsignacionBienes />} />
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/resguardo" element={<ResguardoBienes />} />
              <Route path="/firmarAsigacion" element={<FirmaAsignacionBienes />} />

              <Route path="/firmar" element={<Firma />} />

            </Routes>
            
          </div>
          <hr className="linea-divisoria" />

          <div className="footer-principal">
            <p>
              | ANAM - Agencia Nacional de Aduanas de México - Derechos
              Reservados 2024 &copy;{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
