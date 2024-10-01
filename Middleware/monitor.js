app.get('/monitor', (req, res) => {
    // Mostrar lista de servidores y conexiones
    res.json(servers.map(server => ({
      url: server.url,
      connections: server.connections,
      logs: server.logs
    })));
  });
  
  // Añadir logs a cada servidor
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
  