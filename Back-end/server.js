const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');
const { countTokens } = require('./tokenCounter');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const discoveryURL = process.env.DISCOVERY_URL;
const port = process.env.PORT;

// Registrar servidor en el Discovery
const registerServer = async () => {
    try {
        await axios.post(`${discoveryURL}/register`, { url: `http://localhost:${port}` });
        console.log(`Servidor registrado en el Discovery en el puerto ${port}`);
    } catch (error) {
        console.error(`Error registrando el servidor en el Discovery: ${error.message}`);
    }
};

app.post('/countTokens', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Texto no proporcionado' });

    const tokenCount = countTokens(text);
    console.log(`Tokens contados para el texto: ${text}, cantidad: ${tokenCount}`);
    res.json({ tokenCount });
});

app.listen(port, () => {
    console.log(`Backend corriendo en el puerto ${port}`);
    registerServer(); // Registrar en el Discovery al iniciar
});

// Nuevo endpoint de healthCheck
app.get('/healthCheck', (req, res) => {
    res.status(200).send('OK');
});
