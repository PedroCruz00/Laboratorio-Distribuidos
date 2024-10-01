const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function registerServer(newServerUrl) {
  try {
    const middlewareUrl = `http://${process.env.MIDDLEWARE_IP}:${process.env.MIDDLEWARE_PORT}/register`;
    console.log(`Intentando registrar el servidor en ${middlewareUrl}...`);

    const response = await axios.post(middlewareUrl, {
      url: newServerUrl
    });

    if (response.status === 200) {
      console.log('Servidor registrado exitosamente:', response.data);
    } else {
      console.error('Error al registrar el servidor, código de estado:', response.status);
    }
  } catch (error) {
    console.error('Error al registrar el servidor:', error.message);
  }
}

const serverUrl = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`;
registerServer(serverUrl); // Al iniciar, el servidor se registra automáticamente
