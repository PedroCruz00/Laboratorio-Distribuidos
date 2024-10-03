const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');
const { countTokens } = require('./tokenCounter');
const winston = require('winston');

dotenv.config();
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
        new winston.transports.File({ filename: 'backend.log' })
    ]
});

const discoveryURL = process.env.DISCOVERY_URL;
const port = process.env.PORT;

// Registrar servidor en el Discovery
const registerServer = async () => {
    try {
        await axios.post(`${discoveryURL}/register`, { url: `http://localhost:${port}` });
        logger.info('Servidor registrado en el Discovery', { port });
    } catch (error) {
        logger.error('Error registrando el servidor en el Discovery', { message: error.message });
    }
};

app.post('/countTokens', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Texto no proporcionado' });

    const tokenCount = countTokens(text);
    logger.info('Tokens contados', { text, tokenCount });
    res.json({ tokenCount });
});

app.listen(port, () => {
    logger.info('Backend corriendo', { port });
    registerServer(); // Registrar en el Discovery al iniciar
});
