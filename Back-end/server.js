const express = require('express');
const dotenv = require('dotenv');
const { countTokens } = require('./tokenCounter');

dotenv.config();

const app = express();
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
