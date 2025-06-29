import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importación de páginas principales
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Passwords from './pages/Passwords';
import Users from './pages/Users';
import Sites from './pages/Sites';
import Roles from './pages/Roles';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta raíz: Login es la primera pantalla que verá el usuario */}
        <Route path="/" element={<Login />} />

        {/* Rutas para el resto de componentes */}
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/passwords" element={<Passwords />} />
        <Route path="/users" element={<Users />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
