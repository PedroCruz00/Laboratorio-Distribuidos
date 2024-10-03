require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();
app.use(express.json());
app.use(cors());

let backendServers = [];

// Registrar un nuevo servidor
app.post('/register', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL no proporcionada' });

    backendServers.push(url);
    console.log(`Servidor registrado: ${url}`);
    res.json({ message: 'Servidor registrado', servers: backendServers });
});

// Obtener la lista de servidores
app.get('/servers', (req, res) => {
    console.log('Lista de servidores solicitada');
    res.json({ servers: backendServers });
});

const port = process.env.DISCOVERY_PORT || 4000;
app.listen(port, () => {
    console.log(`Discovery corriendo en el puerto ${port}`);
});