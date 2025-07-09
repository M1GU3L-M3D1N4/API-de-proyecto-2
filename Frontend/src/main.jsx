/**
 * Punto de Entrada Principal de la Aplicación React
 * 
 * Este archivo inicializa la aplicación React y la monta en el DOM.
 * Utiliza React 18 con createRoot para mejor rendimiento y características.
 * 
 * StrictMode ayuda a identificar problemas potenciales en la aplicación
 * durante el desarrollo.
 * 
 * @author Tu Nombre
 * @version 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Estilos globales de la aplicación

/**
 * Inicialización y montaje de la aplicación React
 * Se monta en el elemento con ID 'root' del archivo index.html
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
