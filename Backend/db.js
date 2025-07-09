/**
 * Configuración de Conexión a Base de Datos MySQL
 * 
 * Este archivo configura y establece la conexión a la base de datos MySQL
 * utilizando las variables de entorno definidas en el archivo .env
 * 
 * Variables de entorno requeridas:
 * - DB_HOST: Dirección del servidor MySQL
 * - DB_USER: Usuario de la base de datos
 * - DB_PASSWORD: Contraseña del usuario
 * - DB_NAME: Nombre de la base de datos
 * 
 * @author Tu Nombre
 * @version 1.0.0
 */

const mysql = require('mysql2');
require('dotenv').config();

/**
 * Configuración de la conexión a MySQL
 * Utiliza las variables de entorno para establecer la conexión
 */
const db = mysql.createConnection({
  host: process.env.DB_HOST,        // Dirección del servidor MySQL
  user: process.env.DB_USER,        // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña del usuario
  database: process.env.DB_NAME     // Nombre de la base de datos
});

/**
 * Establecer conexión con la base de datos
 * Muestra mensaje de éxito o error según el resultado
 */
db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    return;
  }
  console.log('✅ Conectado exitosamente a la base de datos MySQL');
});

// Exportar la instancia de conexión para uso en otros módulos
module.exports = db;
