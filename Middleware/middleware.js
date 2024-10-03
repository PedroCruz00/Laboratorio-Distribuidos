require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const winston = require('winston');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'middleware.log' })
    ]
});

const discoveryURL = process.env.DISCOVERY_URL; // URL del Discovery
let backendServers = [];
const requestCounts = {};

// Función para registrar un servidor en el middleware
const registerServers = async () => {
    try {
        const response = await axios.get(`${discoveryURL}/servers`);
        backendServers = response.data.servers;
        backendServers.forEach(server => {
            if (!requestCounts[server]) requestCounts[server] = 0;
        });
        logger.info('Servidores registrados en middleware', { servers: backendServers });
    } catch (error) {
        logger.error('Error obteniendo servidores del Discovery', { message: error.message });
    }
};

// Función para obtener el servidor menos cargado
const getLeastConnectedServer = () => {
    const leastConnected = Object.keys(requestCounts).reduce((a, b) => requestCounts[a] <= requestCounts[b] ? a : b);
    logger.info('Servidor menos cargado seleccionado', { server: leastConnected });
    return leastConnected;
};

// Reiniciar el conteo de peticiones cada minuto
setInterval(() => {
    logger.info('Reiniciando conteo de peticiones');
    Object.keys(requestCounts).forEach(server => requestCounts[server] = 0);
}, 60000);

// Registrar servidores cada cierto tiempo
setInterval(registerServers, 10000); // Actualizar la lista cada 5 segundos

// Ruta para contar tokens
app.post('/countTokens', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Texto no proporcionado' });

    let server = getLeastConnectedServer();
    try {
        const response = await axios.post(`${server}/countTokens`, { text }, { timeout: 5000 });
        requestCounts[server] += 1;
        logger.info('Petición a backend exitosa', { server, text });
        res.json(response.data);
    } catch (error) {
        logger.error('Error en servidor', { server, message: error.message });
        res.status(503).json({ error: 'Ningún servidor está disponible.' });
    }
});

// Monitor para ver el estado del sistema
app.get('/monitor', (req, res) => {
    const logs = backendServers.map(server => ({
        url: server,
        requests: requestCounts[server],
    }));
    logger.info('Monitor solicitado', { logs });
    res.json({ logs });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    logger.info('Middleware corriendo', { port });
    registerServers(); // Llamar al inicio para registrar servidores
});