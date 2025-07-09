/**
 * API REST para Sistema de Gestión de Contraseñas
 * 
 * Este servidor Express proporciona endpoints para:
 * - Autenticación de usuarios (registro y login)
 * - Gestión de contraseñas (CRUD completo)
 * - Administración de usuarios
 * - Gestión de sitios web
 * - Manejo de roles de usuario
 * 
 * Base de datos: MySQL
 * Puerto por defecto: 3000
 * 
 * @author Tu Nombre
 * @version 1.0.0
 */

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

// Configuración del puerto del servidor
const PORT = process.env.PORT || 3000;

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware para parsear JSON en las peticiones
app.use(express.json());

/**
 * Ruta principal del servidor
 * @route GET /
 * @description Endpoint de prueba para verificar que el servidor esté funcionando
 * @returns {string} Mensaje de confirmación
 */
app.get('/', (req, res) => {
  res.send('API is running');
});

/**
 * Obtener lista de todos los usuarios
 * @route GET /api/users
 * @description Retorna todos los usuarios registrados (sin contraseñas por seguridad)
 * @returns {Array} Lista de usuarios con id, username, email y role_id
 */
app.get('/api/users', (req, res) => {
  const query = 'SELECT user_id, username, email, role_id FROM users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error in query:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

/**
 * Registrar un nuevo usuario
 * @route POST /api/register
 * @description Crea una nueva cuenta de usuario en el sistema
 * @body {string} username - Nombre de usuario único
 * @body {string} email - Correo electrónico único
 * @body {string} password - Contraseña del usuario
 * @returns {Object} Mensaje de éxito o error
 */
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  // Validación de campos obligatorios
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Query para insertar nuevo usuario (role_id = 1 por defecto)
  const query = 'INSERT INTO users (username, email, master_password, role_id) VALUES (?, ?, ?, ?)';
  const values = [username, email, password, 1];

  db.query(query, values, (err, result) => {
    if (err) {
      // Manejo de error de duplicado (email o username ya existen)
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'El correo o nombre de usuario ya existe' });
      }
      console.error('Error al registrar:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  });
});

/**
 * Autenticación de usuario (Login)
 * @route POST /api/login
 * @description Autentica las credenciales del usuario
 * @body {string} email - Correo electrónico del usuario
 * @body {string} password - Contraseña del usuario
 * @returns {Object} Mensaje de éxito y datos del usuario o error
 */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validación de campos obligatorios
  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  // Query para buscar usuario con email y contraseña
  const query = 'SELECT * FROM users WHERE email = ? AND master_password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    // Verificar si se encontró el usuario
    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Login exitoso
    res.json({ message: 'Inicio de sesión exitoso', user: results[0] });
  });
});

/**
 * Obtener todas las contraseñas almacenadas
 * @route GET /api/passwords
 * @description Retorna todas las contraseñas guardadas con información del sitio
 * @returns {Array} Lista de contraseñas con datos del sitio asociado
 */
app.get('/api/passwords', (req, res) => {
  // Query JOIN para obtener contraseñas con información del sitio
  const query = `
    SELECT 
      p.password_id,
      p.account_name,
      p.site_username,
      p.encrypted_password,
      s.url AS site_url
    FROM passwords p
    JOIN sites s ON p.site_id = s.site_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener contraseñas:', err);
      return res.status(500).json({ error: 'Error al obtener contraseñas' });
    }
    res.json(results);
  });
});

/**
 * Obtener todos los roles disponibles
 * @route GET /api/roles
 * @description Retorna la lista de roles del sistema
 * @returns {Array} Lista de roles con id y nombre
 */
app.get('/api/roles', (req, res) => {
  const query = 'SELECT * FROM roles';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener roles:', err);
      return res.status(500).json({ error: 'Error al obtener roles' });
    }
    res.json(results);
  });
});

/**
 * Agregar una nueva contraseña
 * @route POST /api/passwords
 * @description Crea una nueva entrada de contraseña en el sistema
 * @body {string} account_name - Nombre de la cuenta
 * @body {string} site_username - Nombre de usuario del sitio
 * @body {string} encrypted_password - Contraseña encriptada
 * @body {string} site_url - URL del sitio web
 * @returns {Object} Mensaje de éxito o error
 */
app.post('/api/passwords', (req, res) => {
  const { account_name, site_username, encrypted_password, site_url } = req.body;

  // Validación de campos obligatorios
  if (!account_name || !site_username || !encrypted_password || !site_url) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Primero, insertar o actualizar el sitio web en la tabla sites
  const insertSite = 'INSERT INTO sites (url) VALUES (?) ON DUPLICATE KEY UPDATE url = url';

  db.query(insertSite, [site_url], (err) => {
    if (err) {
      console.error('Error al insertar sitio web:', err);
      return res.status(500).json({ error: 'Error al insertar sitio web' });
    }

    // Obtener el ID del sitio web recién insertado o existente
    const getSiteId = 'SELECT site_id FROM sites WHERE url = ?';
    db.query(getSiteId, [site_url], (err, siteResult) => {
      if (err || siteResult.length === 0) {
        console.error('Error al obtener site_id:', err);
        return res.status(500).json({ error: 'No se pudo obtener el ID del sitio' });
      }

      const site_id = siteResult[0].site_id;

      // Insertar la nueva contraseña asociada al sitio
      const insertPassword = 'INSERT INTO passwords (site_id, account_name, site_username, encrypted_password) VALUES (?, ?, ?, ?)';
      db.query(
        insertPassword,
        [site_id, account_name, site_username, encrypted_password],
        (err2) => {
          if (err2) {
            console.error('Error al guardar contraseña:', err2);
            return res.status(500).json({ error: 'No se pudo guardar la contraseña' });
          }

          res.status(201).json({ message: 'Contraseña guardada exitosamente' });
        }
      );
    });
  });
});

/**
 * Obtener todos los sitios web registrados
 * @route GET /api/sites
 * @description Retorna la lista de todos los sitios web en el sistema
 * @returns {Array} Lista de sitios con id y URL
 */
app.get('/api/sites', (req, res) => {
  const query = 'SELECT * FROM sites';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener sitios:', err);
      return res.status(500).json({ error: 'Error al obtener sitios' });
    }
    res.json(results);
  });
});

/**
 * Eliminar una contraseña por ID
 * @route DELETE /api/passwords/:id
 * @description Elimina una contraseña específica del sistema
 * @param {string} id - ID de la contraseña a eliminar
 * @returns {Object} Mensaje de confirmación o error
 */
app.delete('/api/passwords/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM passwords WHERE password_id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar contraseña:', err);
      return res.status(500).json({ error: 'No se pudo eliminar la contraseña' });
    }
    
    // Verificar si se eliminó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contraseña no encontrada' });
    }
    
    res.json({ message: 'Contraseña eliminada correctamente' });
  });
});

/**
 * Actualizar una contraseña existente
 * @route PUT /api/passwords/:id
 * @description Actualiza los datos de una contraseña específica
 * @param {string} id - ID de la contraseña a actualizar
 * @body {string} account_name - Nuevo nombre de la cuenta
 * @body {string} site_username - Nuevo nombre de usuario del sitio
 * @body {string} encrypted_password - Nueva contraseña encriptada
 * @body {string} site_url - Nueva URL del sitio
 * @returns {Object} Mensaje de confirmación o error
 */
app.put('/api/passwords/:id', (req, res) => {
  const { id } = req.params;
  const { account_name, site_username, encrypted_password, site_url } = req.body;

  // Validación de campos obligatorios
  if (!account_name || !site_username || !encrypted_password || !site_url) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Primero, insertar o actualizar el sitio web
  const insertSite = 'INSERT INTO sites (url) VALUES (?) ON DUPLICATE KEY UPDATE url = url';

  db.query(insertSite, [site_url], (err) => {
    if (err) {
      console.error('Error al insertar/actualizar sitio web:', err);
      return res.status(500).json({ error: 'Error al procesar sitio web' });
    }

    // Obtener el ID del sitio web
    const getSiteId = 'SELECT site_id FROM sites WHERE url = ?';
    db.query(getSiteId, [site_url], (err, siteResult) => {
      if (err || siteResult.length === 0) {
        console.error('Error al obtener site_id:', err);
        return res.status(500).json({ error: 'No se pudo obtener el ID del sitio' });
      }

      const site_id = siteResult[0].site_id;

      // Actualizar los datos de la contraseña en la base de datos
      const updatePassword = `
        UPDATE passwords 
        SET site_id = ?, account_name = ?, site_username = ?, encrypted_password = ? 
        WHERE password_id = ?
      `;

      db.query(
        updatePassword,
        [site_id, account_name, site_username, encrypted_password, id],
        (err, result) => {
          if (err) {
            console.error('Error al actualizar contraseña:', err);
            return res.status(500).json({ error: 'No se pudo actualizar la contraseña' });
          }

          // Verificar si se actualizó algún registro
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Contraseña no encontrada' });
          }

          res.json({ message: 'Contraseña actualizada exitosamente' });
        }
      );
    });
  });
});

/**
 * Iniciar el servidor Express
 * @description Pone el servidor en funcionamiento en el puerto especificado
 */
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});
