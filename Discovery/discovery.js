require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

let backendServers = [];

app.post('/register', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL no proporcionada' });
    }
    backendServers.push(url);
    res.json({ message: 'Servidor registrado', servers: backendServers });
});

app.listen(process.env.DISCOVERY_PORT, () => {
    console.log(`Discovery service corriendo en el puerto ${process.env.DISCOVERY_PORT}`);
});
