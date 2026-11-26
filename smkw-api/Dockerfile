# Serveur de jeu Kart Able (salons + jeu web) en conteneur : pour un VPS, Fly.io, Railway...
# Construire depuis la racine du depot :  docker build -f smkw-api/Dockerfile -t kart-able .
# Lancer :                                docker run -p 2567:2567 kart-able

FROM node:22-slim AS web
WORKDIR /app/smkw-ui
COPY smkw-ui/package.json smkw-ui/package-lock.json ./
RUN npm ci
COPY smkw-ui/ ./
ARG SITE_URL
ENV SITE_URL=${SITE_URL}
RUN npm run build

FROM rust:1-slim AS server
WORKDIR /app/smkw-api
COPY smkw-api/ ./
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=server /app/smkw-api/target/release/smkw-api /app/smkw-api
COPY --from=web /app/smkw-ui/dist /app/web
ENV SMKW_PORT=2567 SMKW_WEB_DIR=/app/web
EXPOSE 2567
CMD ["/app/smkw-api"]
