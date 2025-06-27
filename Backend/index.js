const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./db'); // conexión a MySQL

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('API is running');
});

// ✅ Ruta para listar usuarios desde la base de datos
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
