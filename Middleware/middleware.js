require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

let logs = [];
let serverStatus = {};  


app.use(express.static(path.join(__dirname, 'Dashboard')));

const discoveryURL = process.env.DISCOVERY_URL;
let backendServers = [];
const requestCounts = {};

// Función para registrar un servidor en el middleware
const registerServers = async () => {
    try {
        const response = await axios.get(`${discoveryURL}/servers`);
        backendServers = response.data.servers;
        
        // Inicializamos el estado de cada servidor como 'Inactivo' o 'Desconocido'
        backendServers.forEach(server => {
            if (!requestCounts[server]) requestCounts[server] = 0;
            if (!serverStatus[server]) serverStatus[server] = 'Desconocido';  // Estado inicial
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
setInterval(registerServers, 5000); // Actualizar la lista cada 5 segundos

// Función para verificar el estado de los servidores
const checkServerHealth = async () => {
    for (let server of backendServers) {
        try {
            const response = await axios.get(`${server}/healthCheck`, { timeout: 3000 });
            if (response.status === 200) {
                serverStatus[server] = 'Activo';  // Marcar como activo si responde correctamente
            }
        } catch (error) {
            serverStatus[server] = 'Inactivo';  // Si no responde, marcar como inactivo
        }
    }
};

// Ejecutar la función de salud de los servidores cada 5 segundos
setInterval(checkServerHealth, 5000);

app.post('/countTokens', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Texto no proporcionado' });

    let server = getLeastConnectedServer();
    const requestLog = {
        instanceName: server,
        requestType: 'POST',
        payload: text,
        date: new Date().toISOString(),
        response: '',
        url: `${server}/countTokens`
    };

    try {
        const response = await axios.post(`${server}/countTokens`, { text }, { timeout: 5000 });
        requestCounts[server] += 1;
        console.log(`Petición exitosa al backend: ${server}`);

        requestLog.response = response.data;
        logs.push(requestLog);  // Guardar log
        res.json(response.data);
    } catch (error) {
        console.error(`Error en servidor: ${server}, mensaje: ${error.message}`);
        requestLog.response = `Error: ${error.message}`;
        logs.push(requestLog);  // Guardar log en caso de error
        res.status(503).json({ error: 'Ningún servidor está disponible.' });
    }
});

// Ruta para el monitor que retorna la información de los servidores y las conexiones
app.get('/monitor', (req, res) => {
    const logsToSend = backendServers.map(server => ({
        url: server,
        requests: requestCounts[server] || 0, // Número de peticiones hechas al servidor
        status: serverStatus[server] || 'Desconocido' // Estado del servidor (Activo o Inactivo)
    }));
    console.log('Monitor solicitado:', logsToSend);
    res.json({ logs: logsToSend });
});

// Nueva ruta para servir los logs
app.get('/logs', (req, res) => {
    const { server } = req.query;
    // Filtrar los logs si se especifica un servidor
    const filteredLogs = server ? logs.filter(log => log.instanceName === server) : logs;
    res.json(filteredLogs);
});

// Ruta para servir el Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'Dashboard', 'index.html')); 
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Middleware corriendo en el puerto ${port}`);
    registerServers(); 
});
