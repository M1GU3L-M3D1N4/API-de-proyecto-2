/**
 * Componente Login - Página de Inicio de Sesión
 * 
 * Este componente proporciona la interfaz de autenticación para usuarios
 * existentes del sistema. Incluye:
 * - Formulario de login con email y contraseña
 * - Validación de campos
 * - Manejo de errores de autenticación
 * - Navegación al dashboard tras login exitoso
 * - Opción para mostrar/ocultar contraseña
 * - Enlaces a registro y recuperación de contraseña
 * 
 * @author Tu Nombre
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

/**
 * Componente Login
 * @returns {JSX.Element} Interfaz de inicio de sesión
 */
function Login() {
  // Hook para navegación programática
  const navigate = useNavigate();
  
  // Estados del componente
  const [showPassword, setShowPassword] = useState(false); // Controla visibilidad de contraseña
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  }); // Datos del formulario
  const [error, setError] = useState(''); // Mensajes de error

  /**
   * Alterna la visibilidad de la contraseña
   */
  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * Maneja los cambios en los campos del formulario
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Maneja el envío del formulario de login
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      // Realizar petición de login al backend
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso
        alert('Inicio de sesión exitoso');
        // Pequeña pausa antes de navegar para evitar conflictos con el alert
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        // Mostrar error de autenticación
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="toggle-password" onClick={handleTogglePassword}>
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit">Ingresar</button>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="login-footer">
        <p><Link to="/forgot-password">¿Olvidaste tu contraseña?</Link></p>
        <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
      </div>
    </div>
  );
}

export default Login;
