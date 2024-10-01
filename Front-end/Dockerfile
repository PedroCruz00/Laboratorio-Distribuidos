# Usamos una imagen de Node.js como base
FROM node:alpine

# Crear directorio de la aplicación en el contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar los archivos del frontend
COPY . .

# Exponer el puerto para servir el frontend
EXPOSE 3000

# Iniciar el servidor para servir el frontend
CMD ["node", "server.js"]
