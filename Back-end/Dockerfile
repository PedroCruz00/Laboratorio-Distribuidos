# Usamos una imagen de Node.js como base
FROM node:14

# Crear y definir el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto definido en el .env (por defecto 3000)
EXPOSE 3000

# Comando para correr la aplicación
CMD [ "node", "server.js" ]
