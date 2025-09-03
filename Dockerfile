# 1) Build Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Si tu as besoin d'une URL d'API : sers-toi de VITE_API_URL (voir plus bas)
RUN npm run build

# 2) Servir statique avec Nginx
FROM nginx:stable-alpine
# (optionnel) supprimer la conf par défaut si présente
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
