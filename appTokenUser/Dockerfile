# Usar la imagen oficial de node como base
FROM node:latest as build

RUN mkdir -p /app

# Establecer el directorio de trabajo
WORKDIR /app

# Agregar el código fuente al contenedor
COPY package.json /app

# Instalar todas las dependencias
RUN npm install

COPY . /app

# Generar la construcción de la aplicación
RUN npm run build --prod


# Etapa 2: Servir la aplicación con el servidor nginx

# Usar la imagen oficial de nginx como base
FROM nginx:latest

# Crear un archivo de configuración Nginx limpio
RUN echo 'events {' > /etc/nginx/nginx.conf && \
    echo '    worker_connections 1024;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '    include       mime.types;' >> /etc/nginx/nginx.conf && \
    echo '    types {' >> /etc/nginx/nginx.conf && \
    echo '        application/javascript js;' >> /etc/nginx/nginx.conf && \
    echo '        application/json json;' >> /etc/nginx/nginx.conf && \
    echo '        text/css css;' >> /etc/nginx/nginx.conf && \
    echo '    }' >> /etc/nginx/nginx.conf && \
    echo '    server {' >> /etc/nginx/nginx.conf && \
    echo '        listen 80;' >> /etc/nginx/nginx.conf && \
    echo '        server_name vps-4741837-x.dattaweb.com;' >> /etc/nginx/nginx.conf && \
    echo '        root /usr/share/nginx/html;' >> /etc/nginx/nginx.conf && \
    echo '        index index.html;' >> /etc/nginx/nginx.conf && \
    echo '        location / {' >> /etc/nginx/nginx.conf && \
    echo '            try_files $uri $uri/ /index.html;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '        location /assets/ {' >> /etc/nginx/nginx.conf && \
    echo '            root /usr/share/nginx/html;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '        location /images/ {' >> /etc/nginx/nginx.conf && \
    echo '            root /usr/share/nginx/html;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '        error_page 404 /index.html;' >> /etc/nginx/nginx.conf && \
    echo '        location = /index.html {' >> /etc/nginx/nginx.conf && \
    echo '            root /usr/share/nginx/html;' >> /etc/nginx/nginx.conf && \
    echo '            internal;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '        error_page 500 502 503 504 /50x.html;' >> /etc/nginx/nginx.conf && \
    echo '        location = /50x.html {' >> /etc/nginx/nginx.conf && \
    echo '            root /usr/share/nginx/html;' >> /etc/nginx/nginx.conf && \
    echo '        }' >> /etc/nginx/nginx.conf && \
    echo '    }' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf


# Copiar el resultado de la construcción para reemplazar el contenido predeterminado de nginx
COPY --from=build /app/dist/app-token-user /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80
