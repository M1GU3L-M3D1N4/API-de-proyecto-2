/**
 * Componente Register - Página de Registro de Usuario
 * 
 * Este componente proporciona la interfaz para registrar nuevos usuarios
 * en el sistema. Incluye:
 * - Formulario de registro con username, email y contraseña
 * - Validación de campos
 * - Manejo de errores de registro
 * - Navegación al login tras registro exitoso
 * - Conexión con API de registro
 * 
 * @author Tu Nombre
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // Estilos específicos para el registro

/**
 * Componente Register
 * @returns {JSX.Element} Interfaz de registro de usuario
 */
function Register() {
  // Hook para navegación programática
  const navigate = useNavigate();
  
  // Estados del componente
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  }); // Datos del formulario de registro

  const [error, setError] = useState(''); // Mensajes de error

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
   * Maneja el envío del formulario de registro
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      // Realizar petición de registro al backend
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso
        alert('Usuario registrado correctamente');
        navigate('/'); // Redirige al login
      } else {
        setError(data.error || 'Ocurrió un error');
      }
    } catch (err) {
      console.error('Error al registrar:', err);
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="register-container">
      <h2>Crear cuenta</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrarse</button>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="register-footer">
        <p>¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link></p>
      </div>
    </div>
  );
}

export default Register;
// Este componente permite a los usuarios registrarse en la aplicación.
// Envía los datos al backend y maneja la redirección al login tras un registro exitoso.
// También maneja errores de validación y conexión con el servidor.