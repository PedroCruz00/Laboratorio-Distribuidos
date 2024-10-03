require('dotenv').config();
const express = require('express');
const winston = require('winston');
const app = express();
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
        new winston.transports.File({ filename: 'discovery.log' })
    ]
});

let backendServers = [];

// Registrar un nuevo servidor
app.post('/register', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL no proporcionada' });

    backendServers.push(url);
    logger.info('Servidor registrado', { url });
    res.json({ message: 'Servidor registrado', servers: backendServers });
});

// Obtener la lista de servidores
app.get('/servers', (req, res) => {
    logger.info('Lista de servidores solicitada', { servers: backendServers });
    res.json({ servers: backendServers });
});

const port = process.env.DISCOVERY_PORT || 4000;
app.listen(port, () => {
    logger.info('Discovery corriendo', { port });
});