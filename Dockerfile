# Etapa 1: Construcción de la aplicación Angular
FROM node:22 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila la aplicación Angular
RUN npm run build --omit=dev

# Para localizar la aplicación para navegador
# RUN ls -la /app/dist/proyecto/browser

# Etapa 2: Servir la aplicación Angular con Nginx
FROM nginx:stable-bookworm

# Copia los archivos compilados desde la etapa de construcción
COPY --from=build /app/dist/app-movies/browser /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]