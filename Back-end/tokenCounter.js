const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// URL del servicio de tokenización, puede ser un servicio externo o local
const TOKENIZER_URL = process.env.TOKENIZER_URL || "https://platform.openai.com/tokenizer";

// Función para contar los tokens
const countTokens = async (text) => {
    try {
        // Llamada a un servicio externo para contar tokens
        const response = await axios.post(TOKENIZER_URL, { text });
        return response.data.tokens; // Ajusta según la estructura de la respuesta
    } catch (error) {
        console.error('Error al contar tokens:', error.message);
        throw new Error('Error al contar tokens.');
    }
};

module.exports = { countTokens };
