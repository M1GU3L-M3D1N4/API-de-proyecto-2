import React, { useEffect, useState } from 'react';
import './Dashboard.css';

// Componente principal del Dashboard
function Dashboard() {
  // Estado para almacenar las contraseñas obtenidas de la API
  const [passwords, setPasswords] = useState([]);
  // Estado para almacenar los usuarios (solo visible para admin)
  const [users, setUsers] = useState([]);
  // Estado para el rol del usuario (1: Admin, 2: Usuario)
  const [role, setRole] = useState(null);
  // Estado para mostrar mensajes de éxito
  const [successMsg, setSuccessMsg] = useState('');

  // Estado para el formulario de agregar nueva contraseña
  const [form, setForm] = useState({
    account_name: '',
    site_username: '',
    encrypted_password: '',
    site_url: '',
  });

  // Estado para el formulario de edición de contraseña
  const [editId, setEditId] = useState(null); // ID de la contraseña en edición
  const [editForm, setEditForm] = useState({
    account_name: '',
    site_username: '',
    encrypted_password: '',
    site_url: '',
  });

  // useEffect para cargar los datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Función para obtener datos de la API
  const fetchData = async () => {
    try {
      // Simulación: asignar rol admin (1)
      setRole(1);

      // Realiza las peticiones a las APIs de contraseñas y usuarios en paralelo
      const [passwordRes, userRes] = await Promise.all([
        fetch('http://localhost:3000/api/passwords'),
        fetch('http://localhost:3000/api/users'),
      ]);

      // Obtiene los datos en formato JSON de cada respuesta
      const [passwordData, userData] = await Promise.all([
        passwordRes.json(),
        userRes.json(),
      ]);

      // Muestra en consola los datos de contraseñas para depuración
      console.log('passwordData:', passwordData);

      // Actualiza los estados con los datos obtenidos
      setPasswords(Array.isArray(passwordData) ? passwordData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      // Muestra errores en consola si ocurre algún problema al cargar datos
      console.error('Error al cargar datos del dashboard:', err);
    }
  };

  // Maneja los cambios en el formulario de agregar contraseña
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja los cambios en el formulario de edición de contraseña
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Envía el formulario para agregar una nueva contraseña
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
        fetchData(); // Recarga los datos
        // Limpia el formulario
        setForm({ account_name: '', site_username: '', encrypted_password: '', site_url: '' });
        // Oculta el mensaje después de 3 segundos
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error al agregar contraseña:', err);
    }
  };

  // Elimina una contraseña por su ID
  const handleDeletePassword = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/passwords/${id}`, { method: 'DELETE' });
      fetchData(); // Recarga los datos
    } catch (err) {
      console.error('Error al eliminar contraseña:', err);
    }
  };

  // Activa el modo edición para una contraseña específica
  const handleEditPassword = (item) => {
    setEditId(item.password_id);
    setEditForm({
      account_name: item.account_name,
      site_username: item.site_username,
      encrypted_password: item.encrypted_password,
      site_url: item.site_url,
    });
  };

  // Guarda los cambios realizados en la edición de una contraseña
  const handleSaveEdit = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/passwords/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      setEditId(null); // Sale del modo edición
      fetchData(); // Recarga los datos
    } catch (err) {
      console.error('Error al editar contraseña:', err);
    }
  };

  // Cancela la edición de una contraseña
  const handleCancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* Mensaje de éxito al realizar alguna acción */}
      {successMsg && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          {successMsg}
        </div>
      )}

      {/* Sección para agregar una nueva contraseña */}
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

      {/* Sección para mostrar las contraseñas guardadas */}
      <section>
        <h2>Contraseñas guardadas</h2>
        {passwords.length === 0 ? (
          <p>No hay contraseñas registradas.</p>
        ) : (
          <table className="password-table">
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
                    // Modo edición de la contraseña
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
                    // Vista normal de la contraseña
                    <>
                      <td>{item.account_name}</td>
                      <td>{item.site_url}</td>
                      <td>{item.site_username}</td>
                      <td>{item.encrypted_password}</td>
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

      {/* Sección de gestión de usuarios, solo visible para admin */}
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
