# Imagen para servir el sitio estático generado en public/
FROM nginx:1.27-alpine
COPY public/ /usr/share/nginx/html/
EXPOSE 80
