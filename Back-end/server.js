require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const tokenCounter = require('./tokenCounter');

// Endpoint para contar tokens
app.post('/countTokens', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Texto no proporcionado' });
    }
    
    // Llamada al módulo tokenCounter para contar tokens
    const tokenCount = tokenCounter.countTokens(text);
    res.json({ tokenCount });
});

// Iniciar el servidor backend
app.listen(process.env.PORT, () => {
    console.log(`Backend corriendo en el puerto ${process.env.PORT}`);
});
