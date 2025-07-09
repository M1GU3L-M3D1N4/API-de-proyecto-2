# Sistema de Gestión de Contraseñas 🔐

Un sistema completo para gestionar contraseñas de forma segura, desarrollado con React (Frontend) y Node.js/Express (Backend).

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Funcionalidades](#funcionalidades)
- [Contribución](#contribución)

## ✨ Características

- **Autenticación de usuarios** (registro y login)
- **Gestión completa de contraseñas** (CRUD)
- **Edición inline** de contraseñas
- **Panel de administración** para gestionar usuarios
- **Interfaz responsive** y moderna
- **Control de acceso basado en roles**
- **API REST** bien estructurada

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.1.0** - Biblioteca principal de interfaz de usuario
- **React Router DOM 7.6.3** - Enrutamiento del cliente
- **Vite 7.0.0** - Herramienta de construcción y desarrollo
- **CSS3** - Estilos modernos y responsivos

### Backend
- **Node.js** - Entorno de ejecución JavaScript
- **Express 5.1.0** - Framework web para Node.js
- **MySQL2 3.14.1** - Driver para base de datos MySQL
- **CORS 2.8.5** - Middleware para habilitar CORS
- **dotenv 16.6.0** - Gestión de variables de entorno

### Base de Datos
- **MySQL** - Sistema de gestión de base de datos relacional

## 📁 Estructura del Proyecto

```
API-P/
├── Backend/
│   ├── index.js          # Servidor principal y rutas API
│   ├── db.js             # Configuración de conexión a base de datos
│   ├── package.json      # Dependencias del backend
│   └── .env              # Variables de entorno (no incluido en repo)
├── Frontend/
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas principales
│   │   ├── App.jsx       # Componente raíz
│   │   ├── main.jsx      # Punto de entrada
│   │   └── index.css     # Estilos globales
│   ├── public/           # Archivos públicos
│   └── package.json      # Dependencias del frontend
└── README.md             # Documentación del proyecto
```

## 🚀 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- MySQL (v8 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd API-P
```

2. **Instalar dependencias del backend**
```bash
cd Backend
npm install
```

3. **Instalar dependencias del frontend**
```bash
cd ../Frontend
npm install
```

## ⚙️ Configuración

### Base de Datos
1. Crear una base de datos MySQL
2. Crear las siguientes tablas:

```sql
-- Tabla de roles
CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL
);

-- Tabla de usuarios
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    master_password VARCHAR(255) NOT NULL,
    role_id INT DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Tabla de sitios web
CREATE TABLE sites (
    site_id INT PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(255) UNIQUE NOT NULL
);

-- Tabla de contraseñas
CREATE TABLE passwords (
    password_id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT,
    account_name VARCHAR(100) NOT NULL,
    site_username VARCHAR(100) NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    FOREIGN KEY (site_id) REFERENCES sites(site_id)
);
```

### Variables de Entorno
Crear un archivo `.env` en la carpeta `Backend/` con:

```env
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=nombre_de_tu_base_de_datos
PORT=3000
```

## 🎯 Uso

### Desarrollo

1. **Iniciar el servidor backend**
```bash
cd Backend
npm start
```

2. **Iniciar el servidor frontend**
```bash
cd Frontend
npm run dev
```

3. **Acceder a la aplicación**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

### Producción

```bash
# Construir el frontend
cd Frontend
npm run build

# Iniciar el servidor backend
cd ../Backend
npm start
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/register` - Registrar nuevo usuario
- `POST /api/login` - Iniciar sesión

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/roles` - Obtener roles disponibles

### Contraseñas
- `GET /api/passwords` - Obtener todas las contraseñas
- `POST /api/passwords` - Crear nueva contraseña
- `PUT /api/passwords/:id` - Actualizar contraseña
- `DELETE /api/passwords/:id` - Eliminar contraseña

### Sitios
- `GET /api/sites` - Obtener todos los sitios web

## 🎨 Funcionalidades

### Para Usuarios
- ✅ Registro y login
- ✅ Agregar nuevas contraseñas
- ✅ Editar contraseñas existentes
- ✅ Eliminar contraseñas
- ✅ Visualizar contraseñas guardadas
- ✅ Cerrar sesión

### Para Administradores
- ✅ Todas las funcionalidades de usuario
- ✅ Gestión de usuarios del sistema
- ✅ Visualización de roles

### Características Técnicas
- ✅ Edición inline de contraseñas
- ✅ Interfaz responsive
- ✅ Validación de formularios
- ✅ Manejo de errores
- ✅ Navegación con React Router
- ✅ API REST estructurada

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 👥 Autor

**Miguel Medina**

---

⭐ Si este proyecto te ha sido útil, ¡dale una estrella!
