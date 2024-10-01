const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Importa CORS
const { countTokens } = require('./tokenCounter');

dotenv.config();

const app = express(); // Asegúrate de inicializar la app aquí
app.use(cors()); // Llama a la función cors()
app.use(express.json());

app.post('/countTokens', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Texto no proporcionado' });
    }

    const tokenCount = countTokens(text);
    res.json({ tokenCount });
});

app.listen(process.env.PORT, () => {
    console.log(`Backend corriendo en el puerto ${process.env.PORT}`);
});
