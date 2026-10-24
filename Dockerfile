# Build statico di Snaply (Vite + React), servito da nginx.
FROM node:22-alpine AS build
WORKDIR /app

# Le variabili VITE_* vengono lette a build time: senza di queste l'app
# partirebbe con cloudName/preset vuoti e l'upload non funzionerebbe.
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_UPLOAD_PRESET
ARG VITE_APP_TITLE
ARG VITE_APP_SUBTITLE
ARG VITE_APP_PRIMARY_COLOR

ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME \
    VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET \
    VITE_APP_TITLE=$VITE_APP_TITLE \
    VITE_APP_SUBTITLE=$VITE_APP_SUBTITLE \
    VITE_APP_PRIMARY_COLOR=$VITE_APP_PRIMARY_COLOR

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.30-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
