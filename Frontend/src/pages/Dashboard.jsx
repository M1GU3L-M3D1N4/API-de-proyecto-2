import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resUsers, resPasswords] = await Promise.all([
        fetch('http://localhost:3000/api/users'),
        fetch('http://localhost:3000/api/passwords'),
      ]);

      if (!resUsers.ok || !resPasswords.ok) {
        throw new Error('Error al obtener los datos');
      }

      const usersData = await resUsers.json();
      const passwordsData = await resPasswords.json();

      setUsers(usersData);
      setPasswords(passwordsData);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      setError('No se pudieron cargar los datos del dashboard');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard</h1>
      {error && <p className="error">{error}</p>}

      <section>
        <h2>Usuarios Registrados</h2>
        <ul>
          {users.map(user => (
            <li key={user.user_id}>
              {user.username} - {user.email}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Contraseñas Almacenadas</h2>
        <ul>
          {passwords.map(pw => (
            <li key={pw.password_id}>
              {pw.site} - {pw.username}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
