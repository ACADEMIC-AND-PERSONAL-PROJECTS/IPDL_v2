# === Stage 1 : Build du React ===
FROM node:20-alpine AS builder

WORKDIR /app

# Copie les fichiers dependances
COPY package*.json ./

# Installation des dependances
RUN npm ci  --silent

# Copie du code
COPY . .
ARG VITE_API_URL=
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# === Stage 2 : Serveur nginx ===
FROM nginx:alpine AS runtime

# Copie du build dans nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuration du serveur nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port 80 du conteneur
EXPOSE 80