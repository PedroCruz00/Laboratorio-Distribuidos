require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Lista de servidores backend
const backendServers = [
    process.env.BACKEND_URL_1,
    process.env.BACKEND_URL_2,
    // Puedes agregar más servidores si tienes otros backends
];

let currentServerIndex = 0;

// Función para obtener el próximo servidor en la lista
function getNextServer() {
    const server = backendServers[currentServerIndex];
    currentServerIndex = (currentServerIndex + 1) % backendServers.length;
    return server;
}

// Endpoint para contar tokens
app.post('/countTokens', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Texto no proporcionado' });
    }

    try {
        // Balanceo de carga circular entre los servidores backend
        const backendUrl = getNextServer();
        const response = await axios.post(`${backendUrl}/countTokens`, { text });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor de backend' });
    }
});

// Iniciar el servidor middleware
app.listen(process.env.PORT, () => {
    console.log(`Middleware corriendo en el puerto ${process.env.PORT}`);
});
