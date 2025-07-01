import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // Estilos específicos para el registro

/**
 * Componente para registrar un nuevo usuario.
 */
function Register() {
  const navigate = useNavigate(); // Hook para redirigir al usuario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  /**
   * Manejador de cambio en los inputs del formulario.
   * Actualiza el estado según el campo modificado.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Manejador del envío del formulario.
   * Envía los datos al backend para crear el usuario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
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