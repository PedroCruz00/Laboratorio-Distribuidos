# Usamos una imagen de nginx para servir el frontend
FROM nginx:alpine

# Copiar los archivos del frontend al directorio de nginx
COPY . /usr/share/nginx/html

# Exponer el puerto para servir la página
EXPOSE 80

# El servidor nginx se inicia automáticamente
