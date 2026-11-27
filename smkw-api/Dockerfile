# Serveur de jeu Kart Able (salons + jeu web) en conteneur : serveur en ligne sur Fly.io
# (fly.toml a la racine), Render, Railway ou un VPS ; ou serveur de reseau local.
# Construire depuis la racine du depot :  docker build -f smkw-api/Dockerfile -t kart-able .
# Lancer :                                docker run -p 2567:2567 kart-able
# En ligne : SMKW_PUBLIC_URL=https://<adresse> (salons prives, aucune adresse locale annoncee) ;
# le port suit SMKW_PORT, sinon PORT (fourni par Render, Railway...).

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
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=server /app/smkw-api/target/release/smkw-api /app/smkw-api
COPY --from=web /app/smkw-ui/dist /app/web
ENV SMKW_WEB_DIR=/app/web
EXPOSE 2567
CMD ["/app/smkw-api"]
