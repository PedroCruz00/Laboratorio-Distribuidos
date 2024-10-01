const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// Lista de servidores con inicialización de logs y conexiones
let servers = [
  { url: process.env.SERVER_1, connections: 0, logs: [] },
  { url: process.env.SERVER_2, connections: 0, logs: [] }
];

// Limpiar conexiones cada minuto
setInterval(() => {
  servers.forEach(server => {
    server.connections = 0;
  });
  console.log('Estadísticas de conexiones reseteadas');
}, 60000);

// Balanceo "Least Connected"
app.post('/countTokens', async (req, res) => {
  const axiosInstance = axios.create({
    timeout: 5000 // Limitar el tiempo de espera a 5 segundos
  });

  const text = req.body.text;

  // Encontrar el servidor con menos conexiones
  let targetServer = servers.reduce((prev, curr) => {
    return prev.connections <= curr.connections ? prev : curr;
  });

  // Intentar enviar la solicitud al servidor con menos conexiones
  try {
    const response = await axiosInstance.post(`${targetServer.url}/countTokens`, { text });
    
    // Incrementar el conteo de conexiones solo si la solicitud fue exitosa
    targetServer.connections += 1;

    // Devolver el resultado al cliente
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error conectando con el servidor ${targetServer.url}:`, error.message);

    // Buscar otro servidor en caso de error
    const fallbackServer = servers.find(server => server !== targetServer);

    if (fallbackServer) {
      try {
        const fallbackResponse = await axiosInstance.post(`${fallbackServer.url}/countTokens`, { text });
        fallbackServer.connections += 1;
        return res.status(200).json(fallbackResponse.data);
      } catch (fallbackError) {
        console.error(`Error conectando con el servidor de respaldo ${fallbackServer.url}:`, fallbackError.message);
      }
    }
  }

  res.status(500).json({ message: 'Ningún servidor disponible' });
});

// Ruta para registrar un nuevo servidor
app.post('/register', (req, res) => {
  const { url } = req.body;

  const serverExists = servers.find(server => server.url === url);
  if (serverExists) {
    return res.status(400).json({ message: 'El servidor ya está registrado' });
  }

  // Registrar servidor con logs inicializados
  servers.push({ url, connections: 0, logs: [] });
  console.log(`Nuevo servidor registrado: ${url}`);
  res.status(200).json({ message: 'Servidor registrado exitosamente' });
});

// Ruta para monitorear servidores
app.get('/monitor', (req, res) => {
  res.json(servers.map(server => ({
    url: server.url,
    connections: server.connections,
    logs: server.logs
  })));
});

// Ruta para añadir logs a cada servidor
app.post('/log', (req, res) => {
  const { url, log } = req.body;
  const server = servers.find(s => s.url === url);
  if (server) {
    server.logs.push(log);
    res.status(200).json({ message: 'Log añadido' });
  } else {
    res.status(404).json({ message: 'Servidor no encontrado' });
  }
});

const port = process.env.MIDDLEWARE_PORT || 8000;
app.listen(port, () => {
  console.log(`Middleware escuchando en el puerto ${port}`);
});
