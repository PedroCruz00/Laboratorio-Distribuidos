require('dotenv').config(); // Cargar las variables de entorno
const express = require('express');
const path = require('path');
const cors = require('cors'); // Importa CORS

const app = express();

// Configurar CORS para permitir el acceso desde el puerto 9000
app.use(cors({
    origin: 'http://192.168.162.89:9000' // Permite solicitudes desde este origen
}));

// Servir archivos estáticos (index.html, CSS, JS)
app.use(express.static(path.join(__dirname, '')));

// Ruta principal para servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Iniciar el servidor en el puerto 9000
const port = process.env.PORT || 9000; // Por defecto será el puerto 9000 si no se encuentra en .env
app.listen(port, () => {
    console.log(`Frontend corriendo en el puerto ${port}`);
});
