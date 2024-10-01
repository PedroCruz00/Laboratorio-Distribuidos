require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importa CORS
const axios = require('axios');

const app = express();

// Configurar CORS para permitir el acceso desde el puerto 9000
app.use(cors({
    origin: 'http://localhost:9000'
}));

app.use(express.json());

const backendServers = [
    process.env.BACKEND_URL
    // Puedes agregar más servidores si tienes un sistema de balanceo de carga
];

let currentServerIndex = 0;

function getNextServer() {
    const server = backendServers[currentServerIndex];
    currentServerIndex = (currentServerIndex + 1) % backendServers.length;
    return server;
}

app.post('/countTokens', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Texto no proporcionado' });
    }

    try {
        const backendUrl = getNextServer();
        const response = await axios.post(`${backendUrl}/countTokens`, { text });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor de backend' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Middleware corriendo en el puerto ${process.env.PORT}`);
});
