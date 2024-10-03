require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const discoveryURL = process.env.DISCOVERY_URL;
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
        console.log('Servidores registrados en middleware:', backendServers);
    } catch (error) {
        console.error(`Error obteniendo servidores del Discovery: ${error.message}`);
    }
};

// Función para obtener el servidor menos cargado
const getLeastConnectedServer = () => {
    const leastConnected = Object.keys(requestCounts).reduce((a, b) => requestCounts[a] <= requestCounts[b] ? a : b);
    console.log(`Servidor menos cargado seleccionado: ${leastConnected}`);
    return leastConnected;
};

// Reiniciar el conteo de peticiones cada minuto
setInterval(() => {
    console.log('Reiniciando conteo de peticiones');
    Object.keys(requestCounts).forEach(server => requestCounts[server] = 0);
}, 60000);

// Registrar servidores cada cierto tiempo
setInterval(registerServers, 10000); // Actualizar la lista cada 10 segundos

// Ruta para contar tokens
app.post('/countTokens', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Texto no proporcionado' });

    let server = getLeastConnectedServer();
    try {
        const response = await axios.post(`${server}/countTokens`, { text }, { timeout: 5000 });
        requestCounts[server] += 1;
        console.log(`Petición exitosa al backend: ${server}`);
        res.json(response.data);
    } catch (error) {
        console.error(`Error en servidor: ${server}, mensaje: ${error.message}`);
        res.status(503).json({ error: 'Ningún servidor está disponible.' });
    }
});

// Monitor para ver el estado del sistema
app.get('/monitor', (req, res) => {
    const logs = backendServers.map(server => ({
        url: server,
        requests: requestCounts[server],
    }));
    console.log('Monitor solicitado:', logs);
    res.json({ logs });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Middleware corriendo en el puerto ${port}`);
    registerServers(); // Llamar al inicio para registrar servidores
});