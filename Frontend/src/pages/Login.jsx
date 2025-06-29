import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; 

function Login() {
  // Estado para los campos del formulario
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Función para enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Por ahora solo mostramos por consola (luego se conectará al backend)
    console.log('Login attempt:', {
      usernameOrEmail,
      password,
    });

    // Aquí iría la lógica de autenticación real

    // Redirigir al dashboard (simulado por ahora)
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        {/* Campo de usuario o correo */}
        <input
          type="text"
          placeholder="Usuario o correo electrónico"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
        />

        {/* Campo de contraseña */}
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        {/* Enlace para recuperar contraseña */}
        <div className="login-footer">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </div>

        {/* Botón para iniciar sesión */}
        <button type="submit">Iniciar Sesión</button>

        {/* Enlace para registrarse */}
        <div className="login-footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
