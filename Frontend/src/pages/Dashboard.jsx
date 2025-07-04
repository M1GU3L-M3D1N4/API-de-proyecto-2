import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [passwords, setPasswords] = useState([]);
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(null); // 1: Admin, 2: Usuario
  const [successMsg, setSuccessMsg] = useState('');

  // Formulario para agregar nueva contraseña
  const [form, setForm] = useState({
    account_name: '',
    site_username: '',
    encrypted_password: '',
    site_url: '',
  });

  // Formulario para editar contraseña
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    account_name: '',
    site_username: '',
    encrypted_password: '',
    site_url: '',
  });

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Simulación: rol admin (1)
      setRole(1);

      const [passwordRes, siteRes, userRes] = await Promise.all([
        fetch('http://localhost:3000/api/passwords'),
        fetch('http://localhost:3000/api/sites'),
        fetch('http://localhost:3000/api/users'),
      ]);

      const [passwordData, siteData, userData] = await Promise.all([
        passwordRes.json(),
        siteRes.json(),
        userRes.json(),
      ]);

      setPasswords(passwordData);
      setSites(siteData);
      setUsers(userData);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleAddPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccessMsg('Contraseña guardada exitosamente');
        fetchData();
        setForm({ account_name: '', site_username: '', encrypted_password: '', site_url: '' });
        setTimeout(() => setSuccessMsg(''), 3000); // Oculta el mensaje después de 3 segundos
      }
    } catch (err) {
      console.error('Error al agregar contraseña:', err);
    }
  };

  const handleDeletePassword = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/passwords/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Error al eliminar contraseña:', err);
    }
  };

  const handleEditPassword = (item) => {
    setEditId(item.password_id);
    setEditForm({
      account_name: item.account_name,
      site_username: item.username || item.site_username,
      encrypted_password: item.password || item.encrypted_password,
      site_url: item.url || item.site_url,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/passwords/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error('Error al editar contraseña:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* Mensaje de éxito */}
      {successMsg && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          {successMsg}
        </div>
      )}

      <section>
        <h2>Agregar nueva contraseña</h2>
        <form onSubmit={handleAddPassword} className="form">
          <input
            name="account_name"
            placeholder="Nombre de la cuenta"
            value={form.account_name}
            onChange={handleChange}
            required
          />
          <input
            name="site_username"
            placeholder="Usuario del sitio"
            value={form.site_username}
            onChange={handleChange}
            required
          />
          <input
            name="encrypted_password"
            placeholder="Contraseña"
            type="password"
            value={form.encrypted_password}
            onChange={handleChange}
            required
          />
          <input
            name="site_url"
            placeholder="Sitio web (URL)"
            value={form.site_url}
            onChange={handleChange}
            required
          />
          <button type="submit">Agregar</button>
        </form>
      </section>

      <section>
        <h2>Contraseñas guardadas</h2>
        {passwords.length === 0 ? (
          <p>No hay contraseñas registradas.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Cuenta</th>
                <th>Sitio</th>
                <th>Usuario</th>
                <th>Contraseña</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((item) => (
                <tr key={item.password_id}>
                  {editId === item.password_id ? (
                    <>
                      <td>
                        <input
                          name="account_name"
                          value={editForm.account_name}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          name="site_url"
                          value={editForm.site_url}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          name="site_username"
                          value={editForm.site_username}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          name="encrypted_password"
                          type="password"
                          value={editForm.encrypted_password}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleSaveEdit(item.password_id)}>Guardar</button>
                        <button onClick={handleCancelEdit}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.account_name}</td>
                      <td>{item.url || item.site_url}</td>
                      <td>{item.username || item.site_username}</td>
                      <td>{item.password || item.encrypted_password}</td>
                      <td>
                        <button onClick={() => handleDeletePassword(item.password_id)}>Eliminar</button>
                        <button onClick={() => handleEditPassword(item)}>Editar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {role === 1 && (
        <section>
          <h2>Gestión de usuarios (Admin)</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.user_id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role_id === 1 ? 'Admin' : 'Usuario'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default Dashboard;
