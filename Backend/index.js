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
