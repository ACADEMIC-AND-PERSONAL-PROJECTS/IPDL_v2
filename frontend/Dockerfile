FROM node:20-alpine AS builder
WORKDIR /app

# --- Laye 1 : depandencies ---
COPY package*.json ./
RUN npm ci  --silent

# --- Layer 2 : source code & build ---
COPY . .
ARG VITE_API_URL=
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# --- Nginx ---
FROM nginx:25-alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost:8088 || exit 1