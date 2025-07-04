const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('API is running');
});

// Listar usuarios
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

// Registrar usuario
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO users (username, email, master_password, role_id) VALUES (?, ?, ?, ?)';
  const values = [username, email, password, 1];

  db.query(query, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'El correo o nombre de usuario ya existe' });
      }
      console.error('Error al registrar:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  const query = 'SELECT * FROM users WHERE email = ? AND master_password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    res.json({ message: 'Inicio de sesión exitoso', user: results[0] });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// Obtener todas las contraseñas almacenadas
app.get('/api/passwords', (req, res) => {
  const query = 'SELECT * FROM passwords';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener contraseñas:', err);
      return res.status(500).json({ error: 'Error al obtener contraseñas' });
    }
    res.json(results);
  });
});

// Obtener todos los roles (opcional)
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

// Agregar una nueva contraseña
app.post('/api/passwords', (req, res) => {
  const { account_name, site_username, encrypted_password, site_url } = req.body;

  if (!account_name || !site_username || !encrypted_password || !site_url) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Insertar sitio web si no existe
  const insertSite = 'INSERT INTO sites (url) VALUES (?) ON DUPLICATE KEY UPDATE url = url';

  db.query(insertSite, [site_url], (err) => {
    if (err) {
      console.error('Error al insertar sitio web:', err);
      return res.status(500).json({ error: 'Error al insertar sitio web' });
    }

    // Obtener el ID del sitio web
    const getSiteId = 'SELECT site_id FROM sites WHERE url = ?';
    db.query(getSiteId, [site_url], (err, siteResult) => {
      if (err || siteResult.length === 0) {
        console.error('Error al obtener site_id:', err);
        return res.status(500).json({ error: 'No se pudo obtener el ID del sitio' });
      }

      const site_id = siteResult[0].site_id;

      // Insertar contraseña asociada al sitio
      const insertPassword = 'INSERT INTO passwords (site_id, account_name, username, site_username, encrypted_password) VALUES (?, ?, ?, ?, ?)';
      db.query(
        insertPassword,
        [site_id, account_name, site_username, site_username, encrypted_password],
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
