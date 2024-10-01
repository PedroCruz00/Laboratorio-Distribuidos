require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importa CORS
const axios = require('axios');

const app = express();

// Configurar CORS para permitir el acceso desde el puerto 9000
app.use(cors());

app.use(express.json());

// Inicializar lista de servidores desde variables de entorno
const backendServers = [
    process.env.BACKEND_URL_1,
    process.env.BACKEND_URL_2
];

// Asegúrate de que las variables de entorno estén configuradas correctamente
if (!backendServers[0] || !backendServers[1]) {
    console.error('Faltan URLs de servidores backend en las variables de entorno');
    process.exit(1); // Salir si no hay servidores
}

// Almacenar el número de peticiones a cada servidor
const requestCounts = new Array(backendServers.length).fill(0);

// Función para obtener el servidor con menos peticiones
function getLeastConnectedServer() {
    const minRequests = Math.min(...requestCounts);
    const index = requestCounts.findIndex(count => count === minRequests);
    return { server: backendServers[index], index };
}

// Reiniciar el conteo de peticiones cada minuto
setInterval(() => {
    console.log('Reiniciando conteos de peticiones');
    requestCounts.fill(0);
}, 60000); // 60000 ms = 1 minuto

app.post('/countTokens', async (req, res) => {
  const { text } = req.body;
  console.log('Received request with text:', text);
  
  if (!text) {
    return res.status(400).json({ error: 'Texto no proporcionado' });
  }
  
  for (let i = 0; i < backendServers.length; i++) {
    const server = backendServers[i];
    console.log(`Attempting to use server: ${server}`);
    
    try {
      const response = await axios.post(`${server}/countTokens`, { text }, { timeout: 5000 });
      console.log('Received response:', response.data);
      requestCounts[i] += 1;
      return res.json(response.data);
    } catch (error) {
      console.error(`Error in server ${server}:`, error.message);
      if (error.code === 'ECONNREFUSED') {
        console.error(`Server ${server} is not running or not accessible`);
      }
    }
  }
  
  return res.status(503).json({ error: 'Ningún servidor responde. Por favor, inténtelo de nuevo más tarde.' });
});

const port = process.env.PORT || 3001; // Asegúrate de que el puerto esté definido
app.listen(port, () => {
    console.log(`Middleware corriendo en el puerto ${port}`);
});
