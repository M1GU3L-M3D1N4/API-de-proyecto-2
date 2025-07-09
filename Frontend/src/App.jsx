/**
 * Componente Principal de la Aplicación
 * 
 * Este componente configura el enrutamiento principal de la aplicación
 * utilizando React Router para navegar entre las diferentes páginas.
 * 
 * Rutas disponibles:
 * - / : Página de login (página principal)
 * - /register : Página de registro de nuevos usuarios
 * - /dashboard : Panel principal del usuario autenticado
 * - /passwords : Gestión de contraseñas
 * - /users : Administración de usuarios
 * - /sites : Gestión de sitios web
 * - /roles : Administración de roles
 * - /forgot-password : Recuperación de contraseña
 * 
 * @author Tu Nombre
 * @version 1.0.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importación de componentes de página
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Passwords from './pages/Passwords';
import Users from './pages/Users';
import Sites from './pages/Sites';
import Roles from './pages/Roles';
import ForgotPassword from './pages/ForgotPassword';

/**
 * Componente App - Configuración de rutas principales
 * @returns {JSX.Element} Aplicación con enrutamiento configurado
 */
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
